import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Sector,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill='#333'>{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};
export default function DashBoard(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0),
    figStyle = { width: "100%", height: "200px" },
    onPieEnter = (_: Event, i: number): void => setActiveIndex(i);
  return (
    <section>
      <header role='group' className='wsBs flexNoWC cGap1v'>
        <h1 className='mg-3b bolded'>
          <strong id='titleTabProfs'>Levantamentos Estatísticos</strong>
        </h1>
        <em>
          <small role='textbox'>Consulte aqui dados sobre avaliações estatísticas do projeto.</small>
        </em>
        <hr />
      </header>
      <section style={{ display: "grid", gridTemplate: "repeat(2, 1fr) / repeat(2, 1fr)", rowGap: "2rem" }}>
        <figure style={figStyle}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              width={500}
              height={300}
              data={[
                {
                  name: "Page A",
                  uv: 4000,
                  pv: 2400,
                  amt: 2400,
                },
                {
                  name: "Page B",
                  uv: 3000,
                  pv: 1398,
                  amt: 2210,
                },
                {
                  name: "Page C",
                  uv: 2000,
                  pv: 9800,
                  amt: 2290,
                },
                {
                  name: "Page D",
                  uv: 2780,
                  pv: 3908,
                  amt: 2000,
                },
                {
                  name: "Page E",
                  uv: 1890,
                  pv: 4800,
                  amt: 2181,
                },
                {
                  name: "Page F",
                  uv: 2390,
                  pv: 3800,
                  amt: 2500,
                },
                {
                  name: "Page G",
                  uv: 3490,
                  pv: 4300,
                  amt: 2100,
                },
              ]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
              <LineChart dataKey='uv' />
            </LineChart>
          </ResponsiveContainer>
        </figure>
        <figure style={figStyle}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              width={500}
              height={300}
              data={[
                {
                  name: "Page A",
                  uv: 4000,
                  pv: 2400,
                  amt: 2400,
                },
                {
                  name: "Page B",
                  uv: 3000,
                  pv: 1398,
                  amt: 2210,
                },
                {
                  name: "Page C",
                  uv: 2000,
                  pv: 9800,
                  amt: 2290,
                },
                {
                  name: "Page D",
                  uv: 2780,
                  pv: 3908,
                  amt: 2000,
                },
                {
                  name: "Page E",
                  uv: 1890,
                  pv: 4800,
                  amt: 2181,
                },
                {
                  name: "Page F",
                  uv: 2390,
                  pv: 3800,
                  amt: 2500,
                },
                {
                  name: "Page G",
                  uv: 3490,
                  pv: 4300,
                  amt: 2100,
                },
              ]}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='pv' stackId='a' fill='#8884d8' />
              <Bar dataKey='uv' stackId='a' fill='#82ca9d' />
            </BarChart>
          </ResponsiveContainer>
        </figure>
        <figure style={{ width: "100%", height: "220px" }}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={[
                  { name: "Group A", value: 400 },
                  { name: "Group B", value: 300 },
                  { name: "Group C", value: 300 },
                  { name: "Group D", value: 200 },
                ]}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                onMouseEnter={onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
        </figure>
        <figure style={{ width: "100%", height: "220px" }}>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart
              cx='50%'
              cy='50%'
              outerRadius='80%'
              data={[
                {
                  subject: "Nutrition",
                  A: 120,
                  B: 110,
                  fullMark: 150,
                },
                {
                  subject: "Physical Education",
                  A: 98,
                  B: 130,
                  fullMark: 150,
                },
                {
                  subject: "Odontology",
                  A: 86,
                  B: 130,
                  fullMark: 150,
                },
                {
                  subject: "Medicine",
                  A: 99,
                  B: 100,
                  fullMark: 150,
                },
                {
                  subject: "Psychology",
                  A: 85,
                  B: 90,
                  fullMark: 150,
                },
                {
                  subject: "General",
                  A: 65,
                  B: 85,
                  fullMark: 150,
                },
              ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey='subject' />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar name='José' dataKey='A' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
              <Radar name='Maria' dataKey='B' stroke='#82ca9d' fill='#82ca9d' fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </figure>
      </section>
    </section>
  );
}
