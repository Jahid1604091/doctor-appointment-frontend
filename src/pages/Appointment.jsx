import React, { useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import {
  useAddReviewMutation,
  useCheckAvailabilityMutation,
  useGetDoctorByIdQuery,
} from "../slices/doctorApiSlice";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import moment from "moment";
import { DatePicker, TimePicker } from "antd";
import { useSelector } from "react-redux";
import { useNewAppointmentMutation } from "../slices/userApiSlice";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import disabledDateTime from "../helpers/timeSpecify";
import StarRatingInput from "../components/doctors/StarRatingInput";
import Rating from "../components/doctors/Rating";

export default function Appointment() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data } = useGetDoctorByIdQuery(id);

  const [newAppointment] = useNewAppointmentMutation();

  const timings = `${moment(data?.timings[0]).format("hh:mm a")} - ${moment(
    data?.timings[1]
  ).format("hh:mm a")}`;

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [available, setAvailable] = useState(false);
  const [checkAvailability] = useCheckAvailabilityMutation();
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [addReview] = useAddReviewMutation();

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      const res = await addReview({
        id,
        rating: +rating,
        comment,
      }).unwrap();
      toast.success(res?.msg);
    } catch (error) {
      toast.error(error.data?.msg);
      console.log(error?.data?.msg || error.error);
    }
  };

  const handleNewAppoint = async (e) => {
    e.preventDefault();
    const { data } = await newAppointment({
      doctor: id,
      user: userInfo._id,
      date,
      time,
    });
    if (data?.success) {
      toast.success("Appointment Done ! Wait for Doctor respond");
      setAvailable(false);
    } else {
      toast.error("Something Wrong!");
      setAvailable(false);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!time || !date) {
      toast.error("Please Select Time and Date");
    } else {
      const { data, error } = await checkAvailability({
        doctor: id,
        user: userInfo._id,
        date,
        time,
      });

      if (data) {
        toast.success(data?.msg);
        setAvailable(true);
      } else {
        toast.error(error?.data?.msg);
        setAvailable(false);
      }
    }
  };

  return (
    <Layout>
      <Wrapper>
        <Container>
          <Row>
            <Col>
              <h3>Appointment</h3>
              <hr />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="text-center mb-2">
                <Card.Body>
                  <Card.Title className="text-uppercase">
                    Appointment Schedule
                  </Card.Title>
                  <div className="text-muted">{timings}</div> <br />
                  <div className="py-1 my-1">
                    <DatePicker
                      autoFocus
                      disabledDate={(d) =>
                        d.isBefore(moment().subtract(1, "days")) ||
                        d.isAfter(moment().add(6, "days"))
                      }
                      // defaultValue={moment()}
                      className="rounded-0"
                      onChange={(v) => setDate(v)}
                      format="DD-MM-YYYY"
                      required
                    />{" "}
                    <TimePicker
                      format="hh:mm a"
                      className="rounded-0 mt-1"
                      onChange={(value) => {
                        setTime(value);
                      }}
                      disabledTime={() => disabledDateTime(data?.timings)}
                    />
                    <br />
                    <div className="btn-group btn-group-sm my-2">
                      {!available && (
                        <Button
                          type="submit"
                          className="btn"
                          onClick={handleCheck}
                        >
                          Check Availability
                        </Button>
                      )}
                      {available && (
                        <Button
                          type="submit"
                          className="btn"
                          onClick={handleNewAppoint}
                        >
                          Appoint Now
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="text-center p-1">
                <Image
                  src={
                    data?.user?.avatar?.url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiF_OQ_-RS1ksidGVXXFQ-nJehHFxbHfIoQ&usqp=CAU"
                  }
                  roundedCircle
                />
                <Card.Body>
                  <h4 className="text-uppercase"> {data?.user.name}</h4>
                  <Card.Subtitle className="mb-2 text-muted text-capitalize fw-bold">
                    {data?.expertise_in}
                  </Card.Subtitle>
                  <Card.Text>
                    <span>
                      {" "}
                      Per Visit : <strong>{data?.fee}</strong> Tk
                    </span>{" "}
                    <br />
                  </Card.Text>

                  <div className="my-2">
                    <Form>
                      <Form.Group
                        className="mb-2"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Add Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={2}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-2"
                        controlId="formBasicCheckbox"
                      >
                        <StarRatingInput setRating={setRating} />
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={handleReview}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Form>

                    {data?.reviews.length === 0 ? (
                      <div>No reviews yet</div>
                    ) : (
                      <>
                        <strong>Patient Reviews</strong>

                        <ListGroup>
                          {data?.reviews.map((r) => {
                            return (
                              <ListGroup.Item
                                key={r._id}
                                className="d-flex justify-content-between align-items-start"
                              >
                                <div className="ms-2 me-auto">
                                  <div className="fw-bold">{r.name}</div>
                                  {r.comment}
                                </div>
                                <Rating rating={r?.rating} reviews={data?.numReviews} />
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </Layout>
  );
}

const Wrapper = styled.section`
  img {
    height: 190px;
    width: 200px;
    margin: 0 auto;
    box-shadow: var(--dark-shadow) !important;
  }
`;
