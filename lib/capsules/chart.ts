/**
 * Chart Capsule - Multi-Platform
 *
 * Data visualization with line, bar, pie, and area charts.
 */

import { CapsuleDefinition } from './types'

export const ChartCapsule: CapsuleDefinition = {
  id: 'chart',
  name: 'Chart',
  description: 'Data visualization charts: line, bar, pie, area',
  category: 'data',
  tags: ['chart', 'graph', 'visualization', 'data', 'analytics'],
  version: '1.0.0',

  props: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['line', 'bar', 'pie', 'area', 'donut'],
      description: 'Chart type'
    },
    {
      name: 'data',
      type: 'array',
      required: true,
      description: 'Chart data points'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Chart title'
    },
    {
      name: 'height',
      type: 'number',
      required: false,
      default: 300,
      description: 'Chart height in pixels'
    },
    {
      name: 'showLegend',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show chart legend'
    },
    {
      name: 'showGrid',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show grid lines'
    },
    {
      name: 'animated',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Animate chart on load'
    },
    {
      name: 'colors',
      type: 'array',
      required: false,
      description: 'Custom color palette'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['recharts'],
      code: `
import React from 'react'
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'

interface DataPoint {
  name: string
  value: number
  [key: string]: string | number
}

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut'
  data: DataPoint[]
  title?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  animated?: boolean
  colors?: string[]
}

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
]

export function Chart({
  type,
  data,
  title,
  height = 300,
  showLegend = true,
  showGrid = true,
  animated = true,
  colors = defaultColors
}: ChartProps) {
  const dataKeys = data.length > 0
    ? Object.keys(data[0]).filter(k => k !== 'name' && typeof data[0][k] === 'number')
    : ['value']

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[i % colors.length], r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={animated}
              />
            ))}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
                isAnimationActive={animated}
              />
            ))}
          </BarChart>
        )

      case 'area':
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip />
            {showLegend && <Legend />}
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.3}
                isAnimationActive={animated}
              />
            ))}
          </AreaChart>
        )

      case 'pie':
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={type === 'donut' ? '60%' : 0}
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={animated}
              label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
`
    },

    ios: {
      framework: 'swiftui',
      minVersion: '16.0',
      dependencies: [],
      imports: ['SwiftUI', 'Charts'],
      code: `
import SwiftUI
import Charts

enum ChartType {
    case line, bar, pie, area, donut
}

struct ChartDataPoint: Identifiable {
    let id = UUID()
    let name: String
    let value: Double
    var color: Color = .blue
}

struct HubLabChart: View {
    let type: ChartType
    let data: [ChartDataPoint]
    var title: String? = nil
    var height: CGFloat = 300
    var showLegend: Bool = true
    var animated: Bool = true
    var colors: [Color] = [.blue, .green, .orange, .red, .purple, .pink, .cyan, .yellow]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let title = title {
                Text(title)
                    .font(.headline)
            }

            chartView
                .frame(height: height)

            if showLegend && (type == .pie || type == .donut) {
                legendView
            }
        }
    }

    @ViewBuilder
    private var chartView: some View {
        switch type {
        case .line:
            Chart(data) { point in
                LineMark(
                    x: .value("Name", point.name),
                    y: .value("Value", point.value)
                )
                .foregroundStyle(colors[0])
                .symbol(Circle())

                PointMark(
                    x: .value("Name", point.name),
                    y: .value("Value", point.value)
                )
                .foregroundStyle(colors[0])
            }
            .chartXAxis {
                AxisMarks(position: .bottom)
            }

        case .bar:
            Chart(data) { point in
                BarMark(
                    x: .value("Name", point.name),
                    y: .value("Value", point.value)
                )
                .foregroundStyle(by: .value("Name", point.name))
                .cornerRadius(4)
            }
            .chartForegroundStyleScale(range: colors)

        case .area:
            Chart(data) { point in
                AreaMark(
                    x: .value("Name", point.name),
                    y: .value("Value", point.value)
                )
                .foregroundStyle(
                    LinearGradient(
                        colors: [colors[0].opacity(0.5), colors[0].opacity(0.1)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )

                LineMark(
                    x: .value("Name", point.name),
                    y: .value("Value", point.value)
                )
                .foregroundStyle(colors[0])
            }

        case .pie, .donut:
            Chart(data) { point in
                SectorMark(
                    angle: .value("Value", point.value),
                    innerRadius: type == .donut ? .ratio(0.6) : .ratio(0),
                    angularInset: 1.5
                )
                .foregroundStyle(by: .value("Name", point.name))
                .cornerRadius(4)
            }
            .chartForegroundStyleScale(range: colors)
        }
    }

    private var legendView: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 8) {
            ForEach(Array(data.enumerated()), id: \\.element.id) { index, point in
                HStack(spacing: 6) {
                    Circle()
                        .fill(colors[index % colors.count])
                        .frame(width: 10, height: 10)
                    Text(point.name)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
    }
}

// MARK: - Preview
#Preview("Charts") {
    ScrollView {
        VStack(spacing: 32) {
            HubLabChart(
                type: .line,
                data: [
                    ChartDataPoint(name: "Jan", value: 100),
                    ChartDataPoint(name: "Feb", value: 150),
                    ChartDataPoint(name: "Mar", value: 120),
                    ChartDataPoint(name: "Apr", value: 180),
                    ChartDataPoint(name: "May", value: 200)
                ],
                title: "Line Chart"
            )

            HubLabChart(
                type: .bar,
                data: [
                    ChartDataPoint(name: "A", value: 40),
                    ChartDataPoint(name: "B", value: 60),
                    ChartDataPoint(name: "C", value: 30),
                    ChartDataPoint(name: "D", value: 80)
                ],
                title: "Bar Chart"
            )

            HubLabChart(
                type: .donut,
                data: [
                    ChartDataPoint(name: "iOS", value: 45),
                    ChartDataPoint(name: "Android", value: 35),
                    ChartDataPoint(name: "Web", value: 20)
                ],
                title: "Platform Distribution"
            )
        }
        .padding()
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 26,
      dependencies: [
        'com.patrykandpatrick.vico:compose-m3:1.13.1'
      ],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.compose.ui.graphics.*',
        'com.patrykandpatrick.vico.compose.*',
        'com.patrykandpatrick.vico.core.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlin.math.cos
import kotlin.math.sin

enum class ChartType { Line, Bar, Pie, Area, Donut }

data class ChartDataPoint(
    val name: String,
    val value: Float
)

val defaultChartColors = listOf(
    Color(0xFF3B82F6),
    Color(0xFF10B981),
    Color(0xFFF59E0B),
    Color(0xFFEF4444),
    Color(0xFF8B5CF6),
    Color(0xFFEC4899)
)

@Composable
fun HubLabChart(
    type: ChartType,
    data: List<ChartDataPoint>,
    modifier: Modifier = Modifier,
    title: String? = null,
    height: Int = 300,
    showLegend: Boolean = true,
    animated: Boolean = true,
    colors: List<Color> = defaultChartColors
) {
    val animationProgress by animateFloatAsState(
        targetValue = if (animated) 1f else 1f,
        animationSpec = tween(1000, easing = EaseOutCubic),
        label = "chart_animation"
    )

    Column(modifier = modifier.fillMaxWidth()) {
        if (title != null) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }

        when (type) {
            ChartType.Line -> LineChartView(data, height, colors, animationProgress)
            ChartType.Bar -> BarChartView(data, height, colors, animationProgress)
            ChartType.Pie, ChartType.Donut -> PieChartView(
                data, height, colors, animationProgress,
                isDonut = type == ChartType.Donut
            )
            ChartType.Area -> AreaChartView(data, height, colors, animationProgress)
        }

        if (showLegend && (type == ChartType.Pie || type == ChartType.Donut)) {
            Spacer(modifier = Modifier.height(16.dp))
            ChartLegend(data, colors)
        }
    }
}

@Composable
private fun LineChartView(
    data: List<ChartDataPoint>,
    height: Int,
    colors: List<Color>,
    progress: Float
) {
    val maxValue = data.maxOfOrNull { it.value } ?: 1f

    Canvas(
        modifier = Modifier
            .fillMaxWidth()
            .height(height.dp)
    ) {
        val width = size.width
        val chartHeight = size.height
        val stepX = width / (data.size - 1).coerceAtLeast(1)

        // Draw grid lines
        for (i in 0..4) {
            val y = chartHeight * i / 4
            drawLine(
                color = Color.LightGray.copy(alpha = 0.5f),
                start = Offset(0f, y),
                end = Offset(width, y),
                strokeWidth = 1.dp.toPx()
            )
        }

        // Draw line
        val path = Path()
        data.forEachIndexed { index, point ->
            val x = index * stepX
            val y = chartHeight - (point.value / maxValue * chartHeight * progress)

            if (index == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }
        }

        drawPath(
            path = path,
            color = colors[0],
            style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round)
        )

        // Draw points
        data.forEachIndexed { index, point ->
            val x = index * stepX
            val y = chartHeight - (point.value / maxValue * chartHeight * progress)
            drawCircle(
                color = colors[0],
                radius = 6.dp.toPx(),
                center = Offset(x, y)
            )
            drawCircle(
                color = Color.White,
                radius = 3.dp.toPx(),
                center = Offset(x, y)
            )
        }
    }
}

@Composable
private fun BarChartView(
    data: List<ChartDataPoint>,
    height: Int,
    colors: List<Color>,
    progress: Float
) {
    val maxValue = data.maxOfOrNull { it.value } ?: 1f

    Canvas(
        modifier = Modifier
            .fillMaxWidth()
            .height(height.dp)
    ) {
        val width = size.width
        val chartHeight = size.height
        val barWidth = width / data.size * 0.6f
        val spacing = width / data.size * 0.4f

        data.forEachIndexed { index, point ->
            val barHeight = (point.value / maxValue * chartHeight * progress)
            val x = index * (barWidth + spacing) + spacing / 2
            val y = chartHeight - barHeight

            drawRoundRect(
                color = colors[index % colors.size],
                topLeft = Offset(x, y),
                size = Size(barWidth, barHeight),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(8f, 8f)
            )
        }
    }
}

@Composable
private fun PieChartView(
    data: List<ChartDataPoint>,
    height: Int,
    colors: List<Color>,
    progress: Float,
    isDonut: Boolean
) {
    val total = data.sumOf { it.value.toDouble() }.toFloat()

    Canvas(
        modifier = Modifier
            .fillMaxWidth()
            .height(height.dp)
    ) {
        val diameter = minOf(size.width, size.height) * 0.8f
        val radius = diameter / 2
        val center = Offset(size.width / 2, size.height / 2)

        var startAngle = -90f
        data.forEachIndexed { index, point ->
            val sweepAngle = (point.value / total * 360f) * progress

            if (isDonut) {
                drawArc(
                    color = colors[index % colors.size],
                    startAngle = startAngle,
                    sweepAngle = sweepAngle,
                    useCenter = false,
                    topLeft = Offset(center.x - radius, center.y - radius),
                    size = Size(diameter, diameter),
                    style = Stroke(width = radius * 0.4f, cap = StrokeCap.Butt)
                )
            } else {
                drawArc(
                    color = colors[index % colors.size],
                    startAngle = startAngle,
                    sweepAngle = sweepAngle,
                    useCenter = true,
                    topLeft = Offset(center.x - radius, center.y - radius),
                    size = Size(diameter, diameter)
                )
            }

            startAngle += sweepAngle
        }
    }
}

@Composable
private fun AreaChartView(
    data: List<ChartDataPoint>,
    height: Int,
    colors: List<Color>,
    progress: Float
) {
    val maxValue = data.maxOfOrNull { it.value } ?: 1f

    Canvas(
        modifier = Modifier
            .fillMaxWidth()
            .height(height.dp)
    ) {
        val width = size.width
        val chartHeight = size.height
        val stepX = width / (data.size - 1).coerceAtLeast(1)

        val path = Path()
        path.moveTo(0f, chartHeight)

        data.forEachIndexed { index, point ->
            val x = index * stepX
            val y = chartHeight - (point.value / maxValue * chartHeight * progress)
            path.lineTo(x, y)
        }

        path.lineTo(width, chartHeight)
        path.close()

        drawPath(
            path = path,
            color = colors[0].copy(alpha = 0.3f)
        )

        // Draw line on top
        val linePath = Path()
        data.forEachIndexed { index, point ->
            val x = index * stepX
            val y = chartHeight - (point.value / maxValue * chartHeight * progress)
            if (index == 0) linePath.moveTo(x, y)
            else linePath.lineTo(x, y)
        }

        drawPath(
            path = linePath,
            color = colors[0],
            style = Stroke(width = 2.dp.toPx())
        )
    }
}

@Composable
private fun ChartLegend(data: List<ChartDataPoint>, colors: List<Color>) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        data.forEachIndexed { index, point ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(colors[index % colors.size])
                )
                Text(
                    text = point.name,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabChartPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            HubLabChart(
                type = ChartType.Bar,
                data = listOf(
                    ChartDataPoint("Jan", 100f),
                    ChartDataPoint("Feb", 150f),
                    ChartDataPoint("Mar", 80f),
                    ChartDataPoint("Apr", 200f)
                ),
                title = "Monthly Sales",
                height = 200
            )

            HubLabChart(
                type = ChartType.Donut,
                data = listOf(
                    ChartDataPoint("iOS", 45f),
                    ChartDataPoint("Android", 35f),
                    ChartDataPoint("Web", 20f)
                ),
                title = "Platform Distribution",
                height = 200
            )
        }
    }
}
`
    }
  },

  children: false,
  preview: '/previews/chart.png'
}
