import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table } from "react-bootstrap";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../slices/adminApiSlice";
import NotFound from "../../components/NotFound";
import { FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import styled from "styled-components";
import Loader from "../../components/Loader";
import Searchbar from "../../components/Searchbar";
import {BiChevronsLeft, BiChevronsRight} from 'react-icons/bi';


export default function Users() {
  const [search, setSearch] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [query, setQuery] = useState({ page: selectedPage});
  const { data, isLoading, isFetching, isError } = useGetAllUsersQuery(query);
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    setQuery({ ...query, search, page: selectedPage });
  }, [search, selectedPage]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteUser(id);
      toast.success("User Deleted!");
    } catch (error) {}
  };

  const tbody_data =
    !isLoading &&
    data?.data?.map((user) => {
      return (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.isDoctor ? "Doctor" : "User"}</td>
          <td>{moment(user.createdAt).format("DD MMM, YY")}</td>
          <td className="trashIcon" onClick={() => handleDelete(user._id)}>
            <FaTrashAlt />
          </td>
        </tr>
      );
    });
  // if (data?.length === 0) return <NotFound>No User Found!</NotFound>

  //for search query avoid loader
  if ((isLoading || isFetching) && !query) {
    return <Loader />;
  }

  return (
    <Layout>
      <Wrapper>
        <div className="d-flex justify-content-between my-2">
          <h4><span className="badge bg-primary">{data?.count} / {data?.total}</span> Users</h4>
          <>
            <input
              type="search"
              placeholder="Search Here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{tbody_data}</tbody>
        </Table>

        {/* pagination */}
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
  .trashIcon {
    transition: var(--transition);
    color: var(--clr-red-dark);
    cursor: pointer;
    &:hover {
      color: var(--clr-red-light);
    }
  }
`;
