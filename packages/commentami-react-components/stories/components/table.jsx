import { px } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import { Reference } from '../../src/components/ui/Reference'

const tableClassName = style({
  borderSpacing: 1
})

const headerClassName = style({
  height: px(30),
  textAlign: 'left',
  textTransform: 'capitalize',
  backgroundColor: '#DDD',
  border: `${px(1)} solid #AAA`
})

const cellClassName = style({
  textAlign: 'left',
  height: px(30),
  border: `${px(1)} solid #AAA`,
  position: 'relative'
})

const commentsMarkerClassName = style({
  height: px(10),
  width: px(10),
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: '#F3704C'
})

export const Table = ({ data, columns, blockComponent }) => (
  <table className={tableClassName}>
    <tbody>
      <Header columns={columns} blockComponent={blockComponent} />
      {data.map(row => <Row key={row._id} data={row} columns={columns} blockComponent={blockComponent} />)}
    </tbody>
  </table>
)

export const Header = ({ columns, blockComponent }) => (
  <tr>
    {columns.map(key => {
      return <HeadCell key={key} data={key} blockComponent={blockComponent} />
    })}
  </tr>
)

export const Row = ({ data, columns, blockComponent }) => (
  <tr>
    {Object.entries(data)
      .filter(([key]) => columns.includes(key))
      .sort(([keyA], [keyB]) => columns.findIndex(key => key === keyA) - columns.findIndex(key => key === keyB))
      .map(([key, value]) => <Cell key={key} id={`${data._id}-${key}`} data={value} blockComponent={blockComponent} />)}
  </tr>
)

export const CommentsMarker = ({ onClick }) => {
  return <div className={commentsMarkerClassName} onClick={onClick} />
}

export function Cell({ id, data, blockComponent: Block }) {
  if (!Block) Block = Reference

  return (
    <td className={cellClassName}>
      <Block reference={id} markerComponent={CommentsMarker}>
        {data}
      </Block>
    </td>
  )
}

export const HeadCell = ({ data }) => <th className={headerClassName}>{data}</th>
