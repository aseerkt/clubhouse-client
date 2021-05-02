import React from 'react'
import {Modal,Comment,Button} from "../../semantichelper"
export default function Highlights({highlightsmodal,getDateTime,setHighlightsModal,thread}) {
    return (
        <Modal
        centered={false}
        open={highlightsmodal}
        onClose={() => setHighlightsModal(false)}
        onOpen={() => setHighlightsModal(true)}
      >
        <Modal.Header>Highlights</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {thread.highlights?.map((item, index) => (
              <Comment.Group>
                <Comment>
                  <Comment.Avatar as="a" src={item.image} />
                  <Comment.Content>
                    <Comment.Author as="a">{item.username}</Comment.Author>
                    <Comment.Metadata>
                                <span>{getDateTime(item.timing)}</span>
                    </Comment.Metadata>
                    <Comment.Text>{item.body}</Comment.Text>
                  </Comment.Content>
                </Comment>
              </Comment.Group>
            ))}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setHighlightsModal(false)}>OK</Button>
        </Modal.Actions>
      </Modal>
    )
}
