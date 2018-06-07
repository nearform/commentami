import { CommentableProvider, CommentsFetchService, CommentsNesService } from '@nearform/comments-react-components'
import { CommentableController } from '@nearform/comments-react-components/dist/ui'
import { em, percent, rem } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import { Block } from '../components/block'
import { Sidebar } from '../components/sidebar'
import data from '../fixtures/data'
import { localStorageService as localStorageServiceBuilder } from '../services/localStorage'
import { debugClassName } from '../styling/environment'
import { pageClassName } from './index'

const localStorageService = localStorageServiceBuilder()
const socketService = CommentsNesService('ws://localhost:8080/')
const httpService = CommentsFetchService('http://localhost:8080/')

const sectionClassName = style(debugClassName('table'), {
  marginTop: rem(3)
})

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
  marginTop: rem(2),
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

function CommentMarker({ onClick }) {
  return <div className={commentMarkerClassName} onClick={onClick} />
}

function Cell({ rowIndex, cellIndex, label, value }) {
  if (typeof value === 'boolean') value = value ? 'Yes' : 'No'

  let Tag = 'td'
  let className = tableCellClassName

  if (label === 'header') {
    Tag = 'th'
    className = tableHeaderCellClassName
  }

  const reference = `${label}:${rowIndex}:${cellIndex}`

  return (
    <Tag className={className}>
      <Block component={Block} reference={reference} markerComponent={CommentMarker}>
        <span>{value}</span>
      </Block>
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

export function MultiplePage() {
  return (
    <div className={pageClassName}>
      <h4>Each table below uses a different storage engine</h4>
      <h4>The page was rendered on Unix Time {new Date().getTime()}</h4>

      <CommentableController>
        <section className={sectionClassName}>
          <h1>LocalStorage</h1>
          <CommentableProvider resource="first" service={localStorageService}>
            <Table data={data} />
            <Sidebar title="First" />
          </CommentableProvider>
        </section>

        <section className={sectionClassName}>
          <h1>Websockets</h1>
          <CommentableProvider resource="second" service={socketService}>
            <Table data={data} />
            <Sidebar title="Second" />
          </CommentableProvider>
        </section>

        <section className={sectionClassName}>
          <h1>HTTP</h1>
          <CommentableProvider resource="third" service={httpService}>
            <Table data={data} />
            <Sidebar title="Second" />
          </CommentableProvider>
        </section>
      </CommentableController>
    </div>
  )
}
