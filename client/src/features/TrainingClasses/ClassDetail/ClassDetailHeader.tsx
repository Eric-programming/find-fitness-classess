import React, { useContext } from "react";
import { Segment, Item, Header, Button, Image } from "semantic-ui-react";
import { ITrainingClass } from "../../../app/_models/ITrainingClasses";
import { Link } from "react-router-dom";
import _addHypthen from "../../../app/_helper/_addHypthen";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/RootStore";
import { _getDayOfWeek } from "../../../app/_helper/_getDayOfWeekWords";
import _getTime from "../../../app/_helper/_getTimes";
const trainingClassImageStyle = {
  filter: "brightness(30%)",
};

const trainingClassImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};
const ClassDetailHeader: React.FC<{ trainingClass: ITrainingClass }> = ({
  trainingClass,
}) => {
  const RootStore = useContext(RootStoreContext);
  const { attendActivity, cancelAttendance } = RootStore.trainingClassessStore;
  const spotsLeft =
    trainingClass.totalSpots - trainingClass.userTrainingClasses.length;
  return (
    <>
      <Segment.Group>
        <Segment basic attached="top" style={{ padding: "0" }}>
          <Image
            src={`/assets/${_addHypthen(trainingClass.category)}.jpeg`}
            fluid
            style={trainingClassImageStyle}
          />
          <Segment style={trainingClassImageTextStyle} basic>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size="huge"
                    content={`${trainingClass.title} ${
                      spotsLeft > 0
                        ? `(${spotsLeft} ${
                            spotsLeft > 1 ? "Spots Left" : "Spot Left!"
                          } )`
                        : "(Full)"
                    }`}
                    style={{ color: "white" }}
                  />
                  <p>
                    Every {_getDayOfWeek(trainingClass.dayOfWeek)} at{" "}
                    {trainingClass.time + _getTime(trainingClass.time).meridiem}
                  </p>
                  <p>
                    Hosted By{" "}
                    <Link to={`/profile/${trainingClass.hostUserName}`}>
                      <strong>{trainingClass.hostName}</strong>
                    </Link>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        <Segment clearing attached="bottom">
          {trainingClass.isHost ? (
            <Button
              as={Link}
              to={`/edit-class/${trainingClass.id}`}
              color="orange"
              floated="right"
            >
              Manage Class
            </Button>
          ) : trainingClass.isGoing ? (
            <Button onClick={() => cancelAttendance()}>
              Cancel attendance
            </Button>
          ) : (
            <Button color="teal" onClick={() => attendActivity()}>
              Join Class
            </Button>
          )}
        </Segment>
      </Segment.Group>
    </>
  );
};

export default observer(ClassDetailHeader);
