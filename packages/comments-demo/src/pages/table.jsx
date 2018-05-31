import { CommentableBlock, CommentableProvider, CommentsFetchService } from '@nearform/comments-react-components'
import { em, percent, rem } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import data from '../fixtures/data'
import { debugClassName } from '../styling/environment'
import { sidebarClassName } from '../styling/sidebar'
import { pageClassName } from './index'
import { blockClassName, highlightedBlockClassName } from './plain'

const commentMarkerClassName = style(debugClassName('table'), {
  position: 'absolute',
  top: 0,
  right: 0,
  width: rem(2),
  height: rem(2),
  overflow: 'hidden',
  $nest: {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: rem(-2),
      right: 0,
      border: `${rem(2)} solid transparent`,
      borderRightColor: '#006600',
      cursor: 'pointer'
    }
  }
})

const tableClassName = style(debugClassName('table'), {
  width: percent(100),
  fontSize: em(0.9),
  marginTop: rem(5),
  border: `${rem(0.1)} solid #C0C0C0`,
  borderSpacing: 0,
  borderCollapse: 'collapse'
})

const tableRowClassName = style(debugClassName('table-row'), {
  textAlign: 'left',
  $nest: {
    '&:nth-child(2n)': {
      backgroundColor: '#F0F0F0'
    },
    '&:nth-child(2n+1)': {
      backgroundColor: '#FCFCFC'
    }
  }
})

const tableHeaderCellClassName = style(debugClassName('table-header-cell'), {
  backgroundColor: '#DA3338',
  color: 'white',
  fontWeight: 'bold',
  $nest: {
    span: {
      display: 'block',
      padding: rem(1)
    }
  }
})

const tableCellClassName = style(debugClassName('table-cell'), {
  border: `${rem(0.1)} solid #C0C0C0`,
  $nest: {
    span: {
      display: 'block',
      padding: rem(1)
    }
  }
})

function humanize(str) {
  if (str.startsWith('_')) str = str.substring(1)

  return (
    str[0].toUpperCase() +
    str
      .substring(1)
      .toLowerCase()
      .replace(/([a-z])([A-Z])/, '$1 $2')
  )
}

function CommentMarker({ rootRef, referenceId, events, handleToggleComment }) {
  const boundHandleClick = events.onClick.bind(null, { id: referenceId, ref: rootRef, scope: 'marker' })

  return (
    <div
      className={commentMarkerClassName}
      ref={rootRef}
      onDoubleClick={handleToggleComment}
      onClick={boundHandleClick} // eslint-disable-line react/jsx-no-bind
    />
  )
}

function Cell({ rowIndex, cellIndex, label, value }) {
  if (typeof value === 'boolean') value = value ? 'Yes' : 'No'

  let Tag = 'td'
  let className = tableCellClassName

  if (label === 'header') {
    Tag = 'th'
    className = tableHeaderCellClassName
  }

  const referenceId = `${label}:${rowIndex}:${cellIndex}`

  return (
    <Tag className={className}>
      <CommentableBlock referenceId={referenceId} className={blockClassName} highlightedClassName={highlightedBlockClassName} markerComponent={CommentMarker}>
        <span>{value}</span>
      </CommentableBlock>
    </Tag>
  )
}

function Row({ index, data, columns }) {
  return (
    <tr className={tableRowClassName}>
      {data
        ? data.map((d, i) => <Cell key={i} rowIndex={index} cellIndex={i} label={columns[i]} value={d} />)
        : columns.map((c, i) => <Cell key={i} rowIndex={index} cellIndex={i} label="header" value={c} />)}
    </tr>
  )
}

function Table({ data }) {
  // Generate columns out of the first entry
  const columns = Object.keys(data[0]).map(humanize)

  return (
    <table className={tableClassName}>
      <thead>
        <Row columns={columns} rowIndex={0} />
      </thead>
      <tbody>{data.map((row, i) => <Row index={i} key={row._id} data={Object.values(row)} columns={columns} />)}</tbody>
    </table>
  )
}

export function TablePage() {
  return (
    <div className={pageClassName}>
      <h1>Welcome!</h1>

      <h2>
        The tables below are generated out of some data structure. <br />Each cell is commentable.
      </h2>

      <CommentableProvider resource="foo" service={CommentsFetchService('http://localhost:8080/')} sidebarClassName={sidebarClassName}>
        <Table data={data} />
      </CommentableProvider>

      <CommentableProvider resource="bar" service={CommentsFetchService('http://localhost:8080/')} sidebarClassName={sidebarClassName}>
        <Table data={data} />
      </CommentableProvider>
    </div>
  )
}
