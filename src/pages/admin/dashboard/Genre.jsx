import React, { useEffect, useState } from "react";
import Table from "../../../components/admin/Table";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiApps2AddLine } from "react-icons/ri";
import { useGenre } from "../../../hooks/useAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function Genre() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedDeleteGenre, setSelectedDeleteGenre] = useState(null);
  const { isLoading, createGenre, getGenres, updateGenre, deleteGenre } = useGenre();
  const [inputs, setInputs] = useState({
    name: {
      value: "",
      isFocused: false,
    },
  });
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    // hiding modal for editing
    if (selectedGenre) {
      setSelectedGenre(null);
      setInputs((prev) => ({ ...prev, name: { ...prev.name, value: "" } }));
    }
  };

  const handlecreateGenre = (e) => {
    e.preventDefault();
    createGenre({ name: inputs.name.value.toLowerCase() }).then((data) => {
      if (data) {
        setTimeout(() => {
          setInputs((prev) => ({ ...prev, name: { ...prev.name, value: "" } }));
          handlegetGenres();
          setShowModal(false);
        }, 1000);
      }
    });
  };

  const handlegetGenres = () => {
    getGenres().then((data) => {
      if (data) {
        setData(data);
      }
    });
  };

  const handleEditGenre = (e) => {
    e.preventDefault();
    updateGenre({ name: inputs.name.value }, selectedGenre._id).then((data) => {
      if (data) {
        setTimeout(() => {
          handlegetGenres();
          setShowModal(false);
          setSelectedGenre(null);
          setInputs((prev) => ({ ...prev, name: { ...prev.name, value: "" } }));
        }, 1000);
      }
    });
  };

  const handleDeleteGenre = (id) => {
    setTimeout(() => {
      setData((prev) => prev.filter((item) => item._id != id));
    }, 400);
    deleteGenre(id);
  };
  useEffect(() => {
    handlegetGenres();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-display  text-2xl ">Create Genre</h1>
        <span
          onClick={handleShowModal}
          className="bg-accent flex px-10 py-3 text-sm text-white font-secondary rounded-full cursor-pointer"
        >
          Add New Genre
        </span>
      </div>
      <table className="w-[100%] border-t border-black/20 overflow-hidden">
        <thead className="bg-[#f1f1f1] h-[50px] font-secondary ">
          <tr className="text-sm">
            <td className="w-[10%]">
              <span className="pl-10"></span>
            </td>
            <td className="w-[80%]">
              <span>Name</span>
            </td>
            <td>
              <span className="pr-10">Action</span>
            </td>
          </tr>
        </thead>

        <tbody className="overflow-hidden">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className={`h-[60px] border-b border-black/20 text-sm font-display capitalize  ${
                  selectedDeleteGenre == item._id
                    ? "translate-x-[100%] opacity-0 duration-500"
                    : "translate-x-0"
                }`}
              >
                <td>
                  <span className="pl-10">
                    <input type="checkbox" className="accent-accent" />
                  </span>
                </td>

                <td>
                  <span>{item.name}</span>
                </td>

                <td className="text-[#555]">
                  <div className="flex gap-3 items-center">
                    <TbEdit
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setSelectedGenre(item);
                        setShowModal(true);
                        setInputs((prev) => ({
                          ...prev,
                          name: { ...prev.name, value: item.name },
                        }));
                      }}
                    />
                    <RiDeleteBinLine
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        handleDeleteGenre(item._id);
                        setSelectedDeleteGenre(item._id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <p className="py-5 border-b text-center">
                  No items on this list{" "}
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        className={`fixed bg-black/20 backdrop-blur-[2px] w-[100%] h-[100%] z-50 top-0 left-0 flex justify-center items-center ${
          !showModal ? "scale-0 delay-300" : "scale-100"
        }`}
      >
        <div
          className={` ${
            !showModal
              ? "scale-0 translate-y-[100%]  "
              : "scale-100 translate-y-0"
          }  duration-300 w-[40%] bg-white min-h-[300px] rounded-4xl flex items-center justify-center flex-col shadow-2xl shadow-black/5`}
        >
          <div className="mb-5 flex items-center justify-center flex-col  font-primary ">
            <RiApps2AddLine size={30} />
            <h1 className="text-[#777]">
              {selectedGenre ? "Edit Genre" : "Add a Genre"}
            </h1>
          </div>

          <form
            action=""
            className="w-[100%] flex items-center justify-center flex-col font-display gap-5"
            onSubmit={selectedGenre ? handleEditGenre : handlecreateGenre}
          >
            <div
              className={`border duration-300 ${
                inputs.name.isFocused ? "border-accent " : "border-[#999] "
              }pl-4 py-3 text-xs  md:w-[60%] rounded-xl`}
            >
              <input
                type="text"
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    name: { ...prev.name, value: e.target.value },
                  }))
                }
                className={`capitalize outline-none duration-500 w-[100%] ${
                  inputs.name.isFocused ? "pl-1" : ""
                }`}
                required
                placeholder="Enter Genre Name"
                onFocus={() =>
                  setInputs((prev) => ({
                    ...prev,
                    name: { ...prev.name, isFocused: true },
                  }))
                }
                onBlur={() =>
                  setInputs((prev) => ({
                    ...prev,
                    name: { ...prev.name, isFocused: false },
                  }))
                }
                value={inputs.name.value}
              />
            </div>

            <button className="bg-accent w-[200px]  px-10 h-10 flex items-center justify-center text-sm text-white font-secondary rounded-full">
              {isLoading ? (
                <LoadingSpinner />
              ) : selectedGenre ? (
                "Edit"
              ) : (
                "Continue"
              )}
            </button>
            <span className="text-sm cursor-pointer" onClick={handleHideModal}>
              Cancel
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
