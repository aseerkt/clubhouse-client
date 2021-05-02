import React from "react";
import { Item, Button } from "../../semantichelper";
export default function ProfileHeader({ user, loginuser, history }) {
  return (
    <Item.Group divided>
          <Item>
          <Item.Image size='tiny' src={user.avatar} />

        <Item.Content style={{ padding: "2rem" }}>
          <Item.Header as="a">{user.username}</Item.Header>
          <Item.Meta>
            <span className="cinema">{user.emailId}</span>
          </Item.Meta>
          <Button
            size="small"
            onClick={() => {
              loginuser(
                {
                  token: null,
                  user: {},
                },
                true
              );
              history.push("/");
            }}
            primary
          >
            Logout
          </Button>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}
