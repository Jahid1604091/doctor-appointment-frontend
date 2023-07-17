import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { useGetAllApprovedDoctorsQuery } from "../slices/userApiSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Fetching from "../components/Fetching";
import NotFound from "../components/NotFound";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import Rating from "../components/doctors/Rating";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [query, setQuery] = useState({page: selectedPage});
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllApprovedDoctorsQuery(query);
  useEffect(() => {
    setQuery({ ...query, search, page: selectedPage });
  }, [search, selectedPage]);
  if (isError) return <Error error={error} />;
  // if (data.length === 0) return <NotFound>No Approved Doctor Found!</NotFound>;
  // if (isLoading) return <Loader />;
  // if (isFetching) return <Fetching />;


  return (
    <Layout>
      <Wrapper>
        <Container>
        <input
              type="search"
              placeholder="Name, Expertise etc ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          {data?.count === 0 && <div>No Approved Doctor Found!</div>}
          <Row className="">
            {data?.data?.map((doctor) => {
              return (
                <Col sm={4} key={doctor._id}>
                  <div disabled={isFetching}>
                    <Card className="card mb-3">
                      <Card.Img
                        variant="top"
                        src={doctor?.user?.avatar?.url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiF_OQ_-RS1ksidGVXXFQ-nJehHFxbHfIoQ&usqp=CAU'}
                        className="avatar"
                      />
                      <Card.Body>
                        <Card.Title>{doctor?.user?.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted text-uppercase">
                          {doctor?.expertise_in}
                        </Card.Subtitle>
                        <Rating rating={doctor?.rating} reviews={doctor?.numReviews} showReviewNumber />
                        <Card.Text>
                          <span>Fee Per Visit (BDT) : {doctor?.fee}</span>
                        </Card.Text>
                        <div className="text-center">
                          <Link to={`doctors/${doctor?._id}`} className="btn btn-primary">
                            Appoint Now
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </Wrapper>
      <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${selectedPage === 1 && 'disabled'}`}>
              <a  onClick={()=>setSelectedPage(selectedPage-1)}  className="page-link" href="#" >
                <BiChevronsLeft/>
              </a>
            </li>

            {[...Array(data?.pages).keys()].map((x) => (
              <li className={`page-item ${selectedPage === x + 1 && "active"}`} key={x}>
                <a onClick={()=>setSelectedPage(x+1)} className="page-link" href="#">
                  {x + 1}
                </a>
              </li>
            ))}
            <li className={`page-item ${selectedPage === data?.pages && 'disabled'}`}>
              <a onClick={()=>setSelectedPage(selectedPage+1)} className="page-link" href="#">
                <BiChevronsRight/>
              </a>
            </li>
          </ul>
        </nav>
    </Layout>
  );
}

const Wrapper = styled.section`
  .card {
    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: auto;
    }
  }
`;
