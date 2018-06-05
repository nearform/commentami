import { px } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import { CommentableBlock } from '../../src/components/core/CommentableBlock'
import { Block } from './block'

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

const commentLabelClassName = style({
  height: px(10),
  width: px(10),
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: '#F3704C'
})

export const Table = ({ data, columns }) => (
  <table className={tableClassName}>
    <tbody>
      <Header columns={columns} />
      {data.map(row => <Row key={row._id} data={row} columns={columns} />)}
    </tbody>
  </table>
)

export const CommentLabel = ({ onClick }) => {
  return <div className={commentLabelClassName} onClick={onClick} />
}

export const Cell = ({ id, data }) => (
  <td className={cellClassName}>
    <CommentableBlock reference={id} render={props => <Block {...props} markerComponent={CommentLabel} />}>
      {data}
    </CommentableBlock>
  </td>
)

export const HeadCell = ({ data }) => <th className={headerClassName}>{data}</th>

export const Row = ({ data, columns }) => (
  <tr>
    {Object.entries(data)
      .filter(([key]) => columns.includes(key))
      .sort(([keyA], [keyB]) => columns.findIndex(key => key === keyA) - columns.findIndex(key => key === keyB))
      .map(([key, value]) => <Cell key={key} id={`${data._id}-${key}`} data={value} />)}
  </tr>
)

export const Header = ({ columns }) => (
  <tr>
    {columns.map(key => {
      return <HeadCell key={key} data={key} />
    })}
  </tr>
)
