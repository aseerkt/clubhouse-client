import React from 'react'
import {Label} from "../../semantichelper"
export default function SaveStatus({admin,thread,savethread}) {
    return (
        <>
        {admin ? (
          <>
            {!thread.issave ? (
              <Label as="a" color="red" tag onClick={() => savethread()}>
                Save this chat
              </Label>
            ) : (
              <>
                {thread.closed ? (
                  <Label as="a" color="red" tag>
                    Closed Thread.
                  </Label>
                ) : (
                  <Label as="a" color="teal" tag>
                    Chat is getting saved.
                  </Label>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {!thread.closed ? (
              <>
                {thread.issave && (
                  <Label as="a" color="teal" tag>
                    Chat is getting saved.
                  </Label>
                )}
              </>
            ) : (
              <Label as="a" color="red" tag>
                Closed Thread.
              </Label>
            )}
          </>
        )}</>
    )
}
