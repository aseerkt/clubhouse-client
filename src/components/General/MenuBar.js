import React from 'react'
import { Menu } from 'semantic-ui-react'

export default function MenuBar({current_page,setCurrentPage,type}) {
    return (
        <Menu pointing secondary>
        <Menu.Item
          name="Threads"
          active={current_page === "threads"}
          onClick={() => {
            setCurrentPage("threads");
          }}
        />
        <Menu.Item
          name="Upcoming"
          active={current_page === "upcomingthreads"}
          onClick={() => {
            setCurrentPage("upcomingthreads");
          }}
        />
        <Menu.Item
          name="Live"
          active={current_page === "livethreads"}
          onClick={() => {
            setCurrentPage("livethreads");
          }}
        />
        <Menu.Item
          name="Saved"
          active={current_page === "savedthreads"}
          onClick={() => {
            setCurrentPage("savedthreads");
          }}
        />
        {type === "profile" &&
          <Menu.Item
            name="Private"
            active={current_page === "privatethreads"}
            onClick={() => {
              setCurrentPage("privatethreads");
            }}
          />}
      </Menu>
    )
}
