import React from "react";
import { Comment } from "../../semantichelper";
export default function CommentNormal({
  item,
  admin,
  addReply,
  addToHighlight,
  thread,
  index,
  getDateTime,
}) {
  return (
    <Comment.Group key={index}>
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
              {admin && (
                <>
                  {thread.highlightindex.includes(index) ? (
                    <Comment.Metadata style={{ cursor: "pointer" }}>
                      Highlighted
                    </Comment.Metadata>
                  ) : (
                    <Comment.Metadata
                      onClick={() =>
                        addToHighlight({
                          comment: item,
                          index: index,
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      Add to highlights
                    </Comment.Metadata>
                  )}
                </>
              )}
            </Comment.Actions>
          )}
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
}
