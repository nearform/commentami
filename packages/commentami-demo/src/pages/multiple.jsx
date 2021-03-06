import React from 'react'
import { style } from 'typestyle'
import { Resource } from '@nearform/commentami-react-components'
import { SidebarsController, DeepLinkController } from '@nearform/commentami-react-components/dist/ui'
import { rem } from 'csx'
import { ErrorIndicator, LoadingIndicator } from '../components/indicators'
import { Table } from '../components/table'
import { TestHTTPComments } from '../components/testHTTPComments'
import { TestWebsocketComments } from '../components/testWebsocketComments'
import { localStorageService as localStorageServiceBuilder } from '../services/localStorage'
import { debugClassName } from '../styling/environment'
import { pageClassName } from './index'
import { Sidebar } from '../components/sidebar'
import { UserContext } from '../components/user'
import { NotificationsList } from '../components/notifications/notificationsList'

import data from '../fixtures/data'

const localStorageService = localStorageServiceBuilder()

const sectionClassName = style(debugClassName('table'), {
  marginTop: rem(3),
  position: 'relative'
})

const notificationsListClass = style(debugClassName('notification-list'), {
  position: 'absolute',
  top: '25px',
  right: '25px',
  background: '#ffffff',
  border: '1px solid #cecece',
  borderRadius: '4px',
  padding: '16px'
})

export function MultiplePage() {
  return (
    <div className={pageClassName}>
      <h4>Each table below uses a different storage engine</h4>
      <h4>The page was rendered on Unix Time {new Date().getTime()}</h4>

      <DeepLinkController>
        <SidebarsController>
          <section className={sectionClassName}>
            <h1>LocalStorage</h1>
            <Resource resource="multiple-1" service={localStorageService}>
              <LoadingIndicator />
              <ErrorIndicator />
              <Table data={data} />
              <Sidebar title="First" />
            </Resource>
          </section>

          <UserContext.Consumer>
            {({ authorization }) => <TestWebsocketComments authorization={authorization} />}
          </UserContext.Consumer>

          <UserContext.Consumer>
            {({ authorization }) => <TestHTTPComments authorization={authorization} />}
          </UserContext.Consumer>
        </SidebarsController>
      </DeepLinkController>

      <NotificationsList className={notificationsListClass} />
    </div>
  )
}
