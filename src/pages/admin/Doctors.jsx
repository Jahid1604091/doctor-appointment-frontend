import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table } from "react-bootstrap";
import {
  useApproveAsDoctorMutation,
  useGetAllDoctorsQuery,
  useRemoveAsDoctorMutation,
} from "../../slices/adminApiSlice";
import { Link } from "react-router-dom";
import NotFound from "../../components/NotFound";
import styled from "styled-components";
import moment from "moment";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [query, setQuery] = useState({ page: selectedPage});
  const { data,isFetching } = useGetAllDoctorsQuery(query);
  const [approveAsDoctor] = useApproveAsDoctorMutation();
  const [removeAsDoctor, { isLoading }] = useRemoveAsDoctorMutation();

  useEffect(() => {
    setQuery({ ...query, search, page: selectedPage });
  }, [search, selectedPage]);

 
  const handleApprove = async (id) => {
    try {
      const res = await approveAsDoctor(id);
      toast.success("Approved!");
    } catch (error) {}
  };

  const handleRemove = async (id) => {
    try {
      const res = await removeAsDoctor(id);
      toast.success("Removed!");
    } catch (error) {}
  };

  const tbody_data = data?.data?.map((doctor) => {
    return (
      <tr key={doctor?._id}>
        <td className="text-capitalize">
          <span
            className={`text-light rounded p-1 bg-${
              doctor?.status === "pending" ? "warning" : "primary"
            }`}
          >
            {doctor?.status}
          </span>
        </td>
        <td>{doctor?.user?.name ? doctor?.user?.name : null}</td>
        <td>{doctor?.email}</td>
        <td>{doctor?.expertise_in}</td>
        <td>{moment(doctor?.createdAt).format("DD MMM YY, hh:mm a")}</td>
        <td>
          {doctor?.status === "pending" ? (
            <span
              className="approve-btn"
              onClick={() => handleApprove(doctor?._id)}
            >
              Approve
            </span>
          ) : (
            <span
              className="approve-btn"
              onClick={() => handleRemove(doctor?._id)}
            >
              Remove
            </span>
          )}
        </td>
      </tr>
    );
  });
  // if (data?.count === 0) return <NotFound>No Doctor Found!</NotFound>;
  if ((isLoading || isFetching) && !query) {
    return <Loader />;
  }

  return (
    <Layout>
      <Wrapper>
      <div className="d-flex justify-content-between my-2">
          <h4><span className="badge bg-primary">{data?.count} / {data?.total}</span> Doctors</h4>
          <>
            <input
              type="search"
              placeholder="Search By Expertise"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Expert In</th>
              <th>Applied At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{tbody_data}</tbody>
        </Table>
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
  .approve-btn {
    transition: var(--transition);
    color: var(--clr-red-dark);
    cursor: pointer;
    &:hover {
      border-bottom: 1px solid var(--clr-primary-1);
      transition: var(--transition);
    }
  }
`;
