export default function ReactSpinner({
  width,
  height,
  scale = 0.8,
  translate,
  display = "block",
}: {
  scale: number;
  width?: number | string;
  height?: number | string;
  translate?: string;
  display?: "block" | "inline-block" | "inline" | "table-row-group";
}): JSX.Element {
  return display === "table-row-group" ? (
    <tbody
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})${translate ? ` translate(${translate})` : ""}`,
      }}>
      <tr>
        <td>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='-11 -10.13 22 20.27' className='react-spinner'>
            <defs>
              <radialGradient id='nucleus-gradient' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                <stop offset='0%' stopColor='#48656e' />
                <stop offset='50%' stopColor='#4f2727' />
                <stop offset='100%' stopColor='#48656e' />
              </radialGradient>
              <linearGradient id='center-ellipse-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#48656e' />
                <stop offset='50%' stopColor='#4f2727' />
                <stop offset='100%' stopColor='#48656e' />
              </linearGradient>
              <linearGradient id='left-ellipse-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#20b0dc' />
                <stop offset='50%' stopColor='#815816' />
                <stop offset='100%' stopColor='#20b0dc' />
              </linearGradient>
              <linearGradient id='right-ellipse-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#815816' />
                <stop offset='50%' stopColor='#20b0dc' />
                <stop offset='100%' stopColor='#815816' />
              </linearGradient>
            </defs>
            <circle r='2' fill='url(#nucleus-gradient)' className='react-nucleus' />
            <g>
              <ellipse rx='10' ry='4.5' stroke='url(#center-ellipse-gradient)' className='react-center-ellipside' />
              <ellipse
                rx='10'
                ry='4.5'
                stroke='url(#left-ellipse-gradient)'
                className='react-left-ellipse'
                transform='rotate(60)'
              />
              <ellipse
                rx='10'
                ry='4.5'
                stroke='url(#right-ellipse-gradient)'
                className='react-right-ellipse'
                transform='rotate(120)'
              />
            </g>
          </svg>
        </td>
      </tr>
    </tbody>
  ) : (
    <span
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})${translate ? ` translate(${translate})` : ""}`,
        display,
      }}>
      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='-11 -10.13 22 20.27' className='react-spinner'>
        <defs>
          <radialGradient id='nucleus-gradient' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
            <stop offset='0%' stopColor='#48656e' />
            <stop offset='50%' stopColor='#4f2727' />
            <stop offset='100%' stopColor='#48656e' />
          </radialGradient>
          <linearGradient id='center-ellipse-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#48656e' />
            <stop offset='50%' stopColor='#4f2727' />
            <stop offset='100%' stopColor='#48656e' />
          </linearGradient>
          <linearGradient id='left-ellipse-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#20b0dc' />
            <stop offset='50%' stopColor='#815816' />
            <stop offset='100%' stopColor='#20b0dc' />
          </linearGradient>
          <linearGradient id='right-ellipse-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#815816' />
            <stop offset='50%' stopColor='#20b0dc' />
            <stop offset='100%' stopColor='#815816' />
          </linearGradient>
        </defs>
        <circle r='2' fill='url(#nucleus-gradient)' className='react-nucleus' />
        <g>
          <ellipse rx='10' ry='4.5' stroke='url(#center-ellipse-gradient)' className='react-center-ellipside' />
          <ellipse
            rx='10'
            ry='4.5'
            stroke='url(#left-ellipse-gradient)'
            className='react-left-ellipse'
            transform='rotate(60)'
          />
          <ellipse
            rx='10'
            ry='4.5'
            stroke='url(#right-ellipse-gradient)'
            className='react-right-ellipse'
            transform='rotate(120)'
          />
        </g>
      </svg>
    </span>
  );
}
