import React from "react";
import { Comment } from "../../semantichelper";
export default function CommentReply({ item,getDateTime, addReply, thread, index }) {
  return (
    <div key={index}>
      <Comment>
        <Comment.Avatar as="a" src={item.ofuserimage} />
        <Comment.Content>
          <Comment.Author as="a">{item.ofuser}</Comment.Author>
          <Comment.Metadata>
            <span>{getDateTime(item.ofusertiming)}</span>
          </Comment.Metadata>
          <Comment.Text>
            <p>{item.ofusercomment}</p>
          </Comment.Text>
        </Comment.Content>

        <Comment.Group>
          <Comment>
            <Comment.Avatar as="a" src={item.image} />
            <Comment.Content>
              <Comment.Author as="a">{item.username}</Comment.Author>
              <Comment.Metadata>
                <span>{getDateTime(item.timing)}</span>
              </Comment.Metadata>
              <Comment.Text>{item.body}</Comment.Text>
              {!thread.closed && (
                <Comment.Actions>
                  <a onClick={() => addReply(item)}>Reply</a>
                </Comment.Actions>
              )}
            </Comment.Content>
          </Comment>
        </Comment.Group>
      </Comment>
    </div>
  );
}
