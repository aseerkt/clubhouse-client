import React from "react";
import { Item, Label, Icon ,Segment} from "semantic-ui-react";
export default function ItemCard({
  key,
  item,
  getDateTime,
  deletethread,
  type,
}) {
  return (
    <a href={!item.schedule_later ? `/thread/${item._id}` : null} key={key}>
          <div className="space">
              <Segment>
        <Item.Group>
          {item.closed && (
            <Label as="a" color="red">
              Saved
            </Label>
          )}
          {item.islive && (
            <Label as="a" color="green">
              Live
            </Label>
          )}
          {item.schedule_later && (
            <Label as="a" color="blue">
              Live at {getDateTime(item.timing)}
            </Label>
          )}
          {item.chat_priv && (
            <Label as="a" color="yellow">
              Private
            </Label>
          )}
          {type === "profile" && (
            <Icon
              name="zip"
              size="large"
              onClick={() => deletethread(item._id)}
              style={{ zIndex: "5000" }}
              color="red"
            />
          )}
          <Item>
            <Item.Content>
              <Item.Header as="a">{item.topic}</Item.Header>
              <Item.Extra>
                Thread created by <strong>{item.createdbyemail}</strong>
              </Item.Extra>
              <Item.Description>{item.description}</Item.Description>
            </Item.Content>
          </Item>
                  </Item.Group>
                  </Segment>
      </div>
    </a>
  );
}
