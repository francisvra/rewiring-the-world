import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import rough from 'roughjs'
import { electrificationData, rewiringOrgs, getMetricValue } from '../data/electrification'

const SKETCH_COLORS = ['#f5ebe0', '#e8c887', '#d4a843', '#b87d20', '#8c5a0e', '#5c3608']
const CIRCUIT_COLORS = ['#112211', '#1a3a1a', '#1e5c1e', '#2a7a2a', '#3a9a3a', '#50c850']

function getColor(value, mode) {
  if (value == null) return mode === 'circuit' ? '#111f11' : '#e8e0d5'
  const scale = mode === 'circuit' ? CIRCUIT_COLORS : SKETCH_COLORS
  // map 0-50% to the color scale
  const t = Math.min(value / 50, 1)
  const idx = Math.floor(t * (scale.length - 1))
  const frac = t * (scale.length - 1) - idx
  if (idx >= scale.length - 1) return scale[scale.length - 1]
  // interpolate
  return d3.interpolateRgb(scale[idx], scale[idx + 1])(frac)
}

// Capital/centroid coords for rewiring orgs [lon, lat]
const ORG_COORDS = {
  840: [-95, 38],
  36: [134, -26],
  554: [172, -42],
}

export default function WorldMap({ mode, metric, onCountryClick, selectedCountryId }) {
  const svgRef = useRef(null)
  const [topoData, setTopoData] = useState(null)
  const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight })

  // Load world atlas
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(setTopoData)
  }, [])

  // Handle resize
  useEffect(() => {
    const handler = () => setDimensions({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleClick = useCallback((e, feature) => {
    const id = +feature.id
    const data = electrificationData[id]
    if (!data) return
    const value = getMetricValue(id, metric)
    onCountryClick({ id, ...data, value })
  }, [metric, onCountryClick])

  // Draw map
  useEffect(() => {
    if (!topoData || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { w, h } = dimensions
    svg.attr('width', w).attr('height', h)

    const projection = d3.geoNaturalEarth1()
      .scale((w / 6.5))
      .translate([w / 2, h / 2])
    const path = d3.geoPath().projection(projection)

    const countries = topojson.feature(topoData, topoData.objects.countries)
    const borders = topojson.mesh(topoData, topoData.objects.countries, (a, b) => a !== b)

    if (mode === 'sketch') {
      // Use Rough.js for hand-drawn effect
      const rc = rough.svg(svgRef.current)
      const g = svg.append('g')

      countries.features.forEach(feature => {
        const id = +feature.id
        const value = getMetricValue(id, metric)
        const fill = getColor(value, mode)
        const isSelected = id === selectedCountryId
        const isOrg = !!rewiringOrgs[id]

        const pathStr = path(feature)
        if (!pathStr) return

        const node = rc.path(pathStr, {
          fill,
          fillStyle: 'solid',
          stroke: isSelected ? '#c17f2a' : '#a0896a',
          strokeWidth: isSelected ? 2 : 0.7,
          roughness: 1.2,
          bowing: 0.5,
        })

        // Add org glow
        if (isOrg) {
          node.setAttribute('filter', 'url(#sketchGlow)')
        }

        node.style.cursor = 'pointer'
        node.addEventListener('click', (e) => handleClick(e, feature))
        g.node().appendChild(node)
      })

      // Graticule
      const grat = d3.geoGraticule()()
      const gratNode = rc.path(path(grat), {
        stroke: '#c8b89a',
        strokeWidth: 0.3,
        fill: 'none',
        roughness: 0.5,
      })
      g.node().appendChild(gratNode)

      // Transparent click-target paths on top of rough drawing
      const clickG = svg.append('g')
      clickG.selectAll('.click-target')
        .data(countries.features)
        .join('path')
        .attr('d', path)
        .attr('fill', 'transparent')
        .attr('stroke', 'none')
        .style('cursor', 'pointer')
        .on('click', (e, feature) => handleClick(e, feature))

    } else {
      // Circuit mode — clean SVG with glow effects
      const defs = svg.append('defs')

      // Glow filter
      const glowFilter = defs.append('filter').attr('id', 'circuitGlow')
      glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur')
      const feMerge = glowFilter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'coloredBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      const ledGlow = defs.append('filter').attr('id', 'ledGlow')
      ledGlow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur')
      const ledMerge = ledGlow.append('feMerge')
      ledMerge.append('feMergeNode').attr('in', 'coloredBlur')
      ledMerge.append('feMergeNode').attr('in', 'SourceGraphic')

      const g = svg.append('g')

      // Graticule
      g.append('path')
        .datum(d3.geoGraticule()())
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#1a3a1a')
        .attr('stroke-width', 0.3)
        .attr('opacity', 0.5)

      // Countries
      g.selectAll('.country')
        .data(countries.features)
        .join('path')
        .attr('class', 'country-path')
        .attr('d', path)
        .attr('fill', feature => {
          const id = +feature.id
          if (rewiringOrgs[id]) return '#c87533'
          const value = getMetricValue(id, metric)
          return getColor(value, mode)
        })
        .attr('stroke', feature => {
          const id = +feature.id
          return id === selectedCountryId ? '#e8a050' : '#2a4a2a'
        })
        .attr('stroke-width', feature => +feature.id === selectedCountryId ? 2 : 0.5)
        .attr('filter', feature => {
          const id = +feature.id
          if (rewiringOrgs[id]) return 'url(#ledGlow)'
          if (id === selectedCountryId) return 'url(#circuitGlow)'
          return null
        })
        .attr('class', feature => {
          const id = +feature.id
          const base = 'country-path'
          return rewiringOrgs[id] ? `${base} led-glow` : base
        })
        .on('click', (e, feature) => handleClick(e, feature))

      // Borders
      g.append('path')
        .datum(borders)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#2a4a2a')
        .attr('stroke-width', 0.4)

      // Animated traces between rewiring org countries
      const orgIds = [840, 36, 554]
      const pairs = [[840, 36], [36, 554], [840, 554]]
      pairs.forEach(([a, b]) => {
        const coordA = ORG_COORDS[a]
        const coordB = ORG_COORDS[b]
        if (!coordA || !coordB) return
        const projA = projection(coordA)
        const projB = projection(coordB)
        if (!projA || !projB) return

        // Great circle arc
        const arc = {
          type: 'LineString',
          coordinates: [coordA, coordB],
        }
        g.append('path')
          .datum(arc)
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke', '#c87533')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.6)
          .attr('class', 'circuit-trace')
          .attr('stroke-dasharray', '8 4')
      })

      // Org dots + labels
      orgIds.forEach(id => {
        const coords = ORG_COORDS[id]
        const projected = projection(coords)
        if (!projected) return
        const org = rewiringOrgs[id]

        g.append('circle')
          .attr('cx', projected[0])
          .attr('cy', projected[1])
          .attr('r', 5)
          .attr('fill', '#e8a050')
          .attr('filter', 'url(#ledGlow)')
          .attr('class', 'led-glow')

        g.append('text')
          .attr('x', projected[0] + 8)
          .attr('y', projected[1] + 4)
          .attr('fill', '#e8a050')
          .attr('font-size', 11)
          .attr('font-family', 'Share Tech Mono, monospace')
          .text(org.name)
      })
    }

    // Sketch mode: defs for glow
    if (mode === 'sketch') {
      const defs = svg.append('defs')
      const sketchGlow = defs.append('filter').attr('id', 'sketchGlow')
      sketchGlow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur')
      const m = sketchGlow.append('feMerge')
      m.append('feMergeNode').attr('in', 'coloredBlur')
      m.append('feMergeNode').attr('in', 'SourceGraphic')
    }

  }, [topoData, mode, metric, dimensions, selectedCountryId, handleClick])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
