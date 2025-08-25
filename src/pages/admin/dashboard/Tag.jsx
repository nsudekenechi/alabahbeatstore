import React, { useEffect, useState } from "react";
import Table from "../../../components/admin/Table";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiApps2AddLine } from "react-icons/ri";
import { useTag } from "../../../hooks/useAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function Tag() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDeleteTag, setSelectedDeleteTag] = useState(null);
  const { isLoading, createTag, getTags, updateTag, deleteTag } = useTag();
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
    if (selectedTag) {
      setSelectedTag(null);
      setInputs((prev) => ({ ...prev, name: { ...prev.name, value: "" } }));
    }
  };

  const handleCreateTag = (e) => {
    e.preventDefault();
    createTag({ name: inputs.name.value.toLowerCase() }).then((data) => {
      if (data) {
        setTimeout(() => {
          setInputs((prev) => ({ ...prev, name: { ...prev.name, value: "" } }));
          handleGetTags();
          setShowModal(false);
        }, 1000);
      }
    });
  };

  const handleGetTags = () => {
    getTags().then((data) => {
      if (data) {
        setData(data);
      }
    });
  };

  const handleEditTag = (e) => {
    e.preventDefault();
    updateTag({ name: inputs.name.value }, selectedTag._id).then((data) => {
      if (data) {
        setTimeout(() => {
          handleGetTags();
          setShowModal(false);
          setSelectedTag(null);
          setInputs((prev) => ({ ...prev, name: { ...prev.name, value: "" } }));
        }, 1000);
      }
    });
  };

  const handleDeleteTag = (id) => {
    setTimeout(() => {
      setData((prev) => prev.filter((item) => item._id != id));
    }, 400);
    deleteTag(id);
  };
  useEffect(() => {
    handleGetTags();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-display  text-2xl ">Create a Tag</h1>
        <span
          onClick={handleShowModal}
          className="bg-accent flex px-10 py-3 text-sm text-white font-secondary rounded-full cursor-pointer"
        >
          Add New Tag
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
                  selectedDeleteTag == item._id
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
                        setSelectedTag(item);
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
                        handleDeleteTag(item._id);
                        setSelectedDeleteTag(item._id);
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
              {selectedTag ? "Edit Tag" : "Add a Tag"}
            </h1>
          </div>

          <form
            action=""
            className="w-[100%] flex items-center justify-center flex-col font-display gap-5"
            onSubmit={selectedTag ? handleEditTag : handleCreateTag}
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
                placeholder="Enter Tag Name"
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
              ) : selectedTag ? (
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
