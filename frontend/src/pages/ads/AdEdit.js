import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import ErrAlert from "../../components/ErrAlert";
import styles from "../../styles/Forms.module.css";

const AdEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const extraInput = useRef([]);
  const [categories, setCategories] = useState({ results: [] });
  const [existingImgs, setExistingImgs] = useState({ results: [] });
  const [adData, setAdData] = useState({
    category: "",
    title: "",
    description: "",
    trade_for: "",
    image: "",
    extra_images: [],
  });
  const { category, title, description, trade_for, image, extra_images } =
    adData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: ad }, { data: categories }, { data: images }] =
          await Promise.all([
            await axiosReq.get(`/ad/${id}/`),
            await axiosReq.get("/categories/"),
            await axiosReq.get(`/ad-images/?ad=${id}`),
          ]);
        const { is_owner, category, title, description, trade_for, image } = ad;
        const extraImgs = images.map((img) => img.image);
        is_owner
          ? setAdData({
              category,
              title,
              description,
              trade_for,
              image,
              extra_images: extraImgs,
            })
          : navigate("/");
        setExistingImgs({ results: images });
        setCategories({ results: categories });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id, navigate]);

  const handleChange = (event) => {
    setAdData({
      ...adData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setAdData({
        ...adData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const removeImg = (event) => {
    const extraImgs = extra_images.filter((img) => img !== event.target.value);
    setAdData({ ...adData, extra_images: extraImgs });
    existingImgs.results.forEach((img) => {
      if (img.image === event.target.value) {
        deleteImg(img);
      }
    });
  };

  const deleteImg = async (img) => {
    try {
      await axiosRes.delete(`/ad-image/${img.id}/`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeMultiImage = (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
      console.log(extra_images.length);
      if (extra_images.length === 4) {
        break;
      }
      setAdData((prevAdData) => ({
        ...prevAdData,
        extra_images: [
          ...prevAdData.extra_images,
          URL.createObjectURL(event.target.files[i]),
        ],
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("category", parseInt(category));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("trade_for", trade_for);
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }
    if (extraInput.current.files.length) {
      for (let i = 0; i < extraInput.current.files.length; i++) {
        formData.append("extra_images", extraInput.current.files[i]);
      }
    }

    try {
      await axiosReq.put(`/ad/${id}/`, formData);
      navigate(`/ad/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={`w-11/12 mx-auto rounded-lg flex flex-col items-center ${styles.FormBG}`}
      >
        <h1>Update Ad</h1>
        <div className="flex flex-row flex-wrap my-4 w-full">
          <div className="flex flex-col w-4/5 lg:w-2/5 mx-auto">
            <label>Ad Title</label>
            <input
              className="p-2 my-4"
              placeholder="Enter a title for your ad"
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
            />
            {errors.title?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Category</label>
            <select
              className="p-2 my-4"
              name="category"
              id="category"
              value={category}
              onChange={handleChange}
            >
              <option>Select A Category</option>
              {categories.results.length ? (
                categories.results.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option>No Categories Available</option>
              )}
            </select>
            {errors.category?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Description</label>
            <input
              className="p-2 my-4"
              placeholder="Enter a description of your plant"
              type="textarea"
              name="description"
              value={description}
              onChange={handleChange}
            />
            {errors.description?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Will Trade For</label>
            <input
              className="p-2 my-4"
              placeholder="What you're willing to trade for"
              type="text"
              name="trade_for"
              value={trade_for}
              onChange={handleChange}
            />
          </div>
          {errors.trade_for?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
          <div className="flex flex-col w-4/5 lg:w-2/5 mx-auto py-4">
            <label>Change Main Image</label>
            <figure className="mx-auto w-60 h-60">
              <img
                src={image}
                alt="Main ad"
                className="object-contain w-full h-full"
              />
            </figure>
            <input
              className="p-2 my-4"
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              ref={imageInput}
            />
            {errors.image?.map((message, index) => (
              <ErrAlert key={index} message={message} />
            ))}
            <label>Change Additional Images</label>
            <div className="flex flex-row mx-auto justify-items-center">
              {extra_images.length ? (
                extra_images.map((img, index) => (
                  <div key={index}>
                    <figure className="w-28 h-28 mx-auto">
                      <img
                        src={img}
                        alt={`extra img ${index}`}
                        className="object-contain w-full h-full"
                      />
                    </figure>
                    <button
                      type="button"
                      className="links"
                      value={img}
                      onClick={(event) => removeImg(event)}
                    >
                      Delete
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 inline-block"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <p>No additional images.</p>
              )}
            </div>
            <div className="mt-8">
              {extra_images.length < 4 ? (
                <input
                  className="pb-2 mb-4"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChangeMultiImage}
                  ref={extraInput}
                />
              ) : (
                <p>Maximum number of images added</p>
              )}
            </div>
          </div>
          {errors.extra_images?.map((message, index) => (
            <ErrAlert key={index} message={message} />
          ))}
        </div>
        <button type="submit" className="links">
          Update Ad
        </button>
        {errors.non_field_errors?.map((message, index) => (
          <ErrAlert key={index} message={message} />
        ))}
      </form>
    </div>
  );
};

export default AdEdit;
