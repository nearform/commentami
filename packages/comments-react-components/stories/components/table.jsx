import React from 'react'

import { CommentableTextBlock } from '../../src/components/Commentable/TextBlock'
import { CommentIcon } from '../../src/components/Commentable/CommentIcon'

const styles = {
  table: {
    borderSpacing: 1
  },
  header: {
    height: '30px',
    textAlign: 'left',
    textTransform: 'capitalize',
    backgroundColor: '#ddd',
    border: '1px solid #aaa'
  },
  cell: {
    height: '30px',
    textAlign: 'left',
    backgroundColor: '#f3f3f3',
    padding: '3px',
    border: '1px solid #aaa'
  },
  commentLabel: {
    height: '10px',
    width: '10px',
    position: 'relative',
    float: 'right',
    top: -9,
    right: -3,
    backgroundColor: '#f3704c'
  }
}

export const Table = ({ data, columns }) => (
  <table style={styles.table}>
    <tbody>
      <Header columns={columns} />
      {data.map(row => <Row key={row._id} data={row} columns={columns} />)}
    </tbody>
  </table>
)

export const CommentLabel = () => <div style={styles.commentLabel} />

export const Cell = ({ id, data }) => (
  <td style={styles.cell}>
    <CommentableTextBlock blockId={id}>
      <CommentIcon>
        <CommentLabel />
      </CommentIcon>
      {data}
    </CommentableTextBlock>
  </td>
)

export const HeadCell = ({ data }) => <th style={styles.header}>{data}</th>

export const Row = ({ data, columns }) => (
  <tr>
    {Object.entries(data)
      .filter(([key]) => columns.includes(key))
      .sort(
        ([keyA], [keyB]) =>
          columns.findIndex(key => key === keyA) -
          columns.findIndex(key => key === keyB)
      )
      .map(([key, value]) => (
        <Cell key={key} id={`${data._id}-${key}`} data={value} />
      ))}
  </tr>
)

export const Header = ({ columns }) => (
  <tr>
    {columns.map(key => {
      return <HeadCell key={key} data={key} />
    })}
  </tr>
)
