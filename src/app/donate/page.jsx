"use client";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Gift,
  Shirt,
  ToyBrick,
  Package,
  BookOpen,
  CalendarDays,
  Laptop,
  UploadCloud,
  MapPin,
  Info,
  Send,
  Armchair,
  Utensils,
  X,
  Plus,
} from "lucide-react";

const categories = [
  {
    name: "Food",
    icon: <Utensils size={22} />,
  },
  {
    name: "Clothes",
    icon: <Shirt size={22} />,
  },
  {
    name: "Toys",
    icon: <ToyBrick size={22} />,
  },
  {
    name: "Others",
    icon: <Package size={22} />,
  },
  {
    name: "Books",
    icon: <BookOpen size={22} />,
  },
  {
    name: "Furniture",
    icon: <Armchair size={22} />,
  },
  {
    name: "Electronics",
    icon: <Laptop size={22} />,
  },
];

const initialForm = {
  itemName: "",
  brand: "",
  quantity: "",
  condition: "",
  price: "",
  originalPrice: "",
  description: "",

  // category specific
  size: "",
  gender: "",
  material: "",

  ageGroup: "",
  toyType: "",

  expiryDate: "",
  foodType: "",
  packaging: "",

  author: "",
  genre: "",
  language: "",

  dimensions: "",
  furnitureMaterial: "",

  model: "",
  warranty: "",
  powerSource: "",

  itemType: "",

  // pickup
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  date: "",
  time: "",
};
export default function DonatePage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState("Clothes");

  const [form, setForm] = useState(initialForm);

  const [images, setImages] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  /* =====================================================
     GET LOGGED IN USER
  ===================================================== */
useEffect(() => {
  const savedUser = localStorage.getItem("user");

  // User login nahi hai
  if (!savedUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login or signup before donating an item.",
      confirmButtonColor: "#15803d",
    }).then(() => {
      router.push("/login");
    });

    return;
  }

  // User login hai
  try {
    const parsedUser = JSON.parse(savedUser);

    console.log("LOGGED IN USER:", parsedUser);
    console.log("USER ID:", parsedUser.id);

    setUser(parsedUser);
  } catch (error) {
    console.error("User data error:", error);

    localStorage.removeItem("user");
    router.push("/login");
  }
}, [router]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     CATEGORY CHANGE
  ===================================================== */

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    toast.success(`${category} Selected`);

    setForm((prev) => ({
      ...prev,

      size: "",
      gender: "",
      material: "",

      ageGroup: "",
      toyType: "",

      expiryDate: "",
      foodType: "",
      packaging: "",

      author: "",
      genre: "",
      language: "",

      dimensions: "",
      furnitureMaterial: "",

      model: "",
      warranty: "",
      powerSource: "",

      itemType: "",
    }));
  };

  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Maximum 5 images are allowed.");
      return;
    }

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      toast.error("Only image files are allowed.");
      return;
    }

    setImages(validFiles);

    const previews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    toast.success("Images uploaded successfully");
  };

  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );

    toast.success("Image removed");
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    Swal.fire({
      icon: "warning",
      title: "Cancel Donation?",
      text: "All entered information will be removed.",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setForm(initialForm);
        setImages([]);
        setImagePreviews([]);

        toast.success("Form cleared");
      }
    });
  };

  /* =====================================================
     SUBMIT DONATION
  ===================================================== */

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user?.id) {
    toast.error("Please login first.");
    router.push("/login");
    return;
  }

  // =========================================
  // REQUIRED FIELDS
  // =========================================

  if (
    !form.itemName.trim() ||
    !form.quantity ||
    !form.condition ||
    !form.address.trim() ||
    !form.city.trim() ||
    !form.state.trim() ||
    !form.pincode.trim() ||
    !form.phone.trim()
  ) {
    Swal.fire({
      icon: "error",
      title: "Required Fields Missing",
      text: "Please fill all required fields.",
      confirmButtonColor: "#15803d",
    });

    return;
  }

  // =========================================
  // CLOTHES VALIDATION
  // =========================================

  if (
    selectedCategory === "Clothes" &&
    (!form.size || !form.gender)
  ) {
    Swal.fire({
      icon: "error",
      title: "Clothes Details Missing",
      text: "Please select clothes size and gender.",
      confirmButtonColor: "#15803d",
    });

    return;
  }

  // =========================================
  // IMAGE CONVERSION
  // =========================================

  const imageData = [];

  try {
    for (const file of images) {
      const base64 = await convertImageToBase64(file);

      imageData.push({
        name: file.name,
        data: base64,
      });
    }
  } catch (error) {
    console.error("Image conversion error:", error);

    Swal.fire({
      icon: "error",
      title: "Image Error",
      text: "Unable to process uploaded images.",
      confirmButtonColor: "#15803d",
    });

    return;
  }

  setLoading(true);

  // =========================================
  // CREATE DONATION
  // =========================================

  try {
    const response = await fetch("/api/donate", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        // IMPORTANT
        userId: user.id,

        // Item details
        itemName: form.itemName.trim(),

        brand: form.brand?.trim() || null,

        category: selectedCategory,

        quantity: String(form.quantity),

        condition: form.condition,

        price:
          form.price !== ""
            ? Number(form.price)
            : null,

        originalPrice:
          form.originalPrice !== ""
            ? Number(form.originalPrice)
            : null,

        description:
          form.description?.trim() || null,

        // Images
        images: imageData,

        // Category specific details
        details: {
          size: form.size || "",
          gender: form.gender || "",
          material: form.material || "",

          ageGroup: form.ageGroup || "",
          toyType: form.toyType || "",

          expiryDate: form.expiryDate || "",
          foodType: form.foodType || "",
          packaging: form.packaging || "",

          author: form.author || "",
          genre: form.genre || "",
          language: form.language || "",

          dimensions: form.dimensions || "",
          furnitureMaterial:
            form.furnitureMaterial || "",

          model: form.model || "",
          warranty: form.warranty || "",
          powerSource: form.powerSource || "",

          itemType: form.itemType || "",
        },

        // Pickup details
        address: form.address.trim(),

        city: form.city.trim(),

        state: form.state.trim(),

        pincode: form.pincode.trim(),

        phone: form.phone.trim(),

        date: form.date || null,

        time: form.time || null,
      }),
    });

    const data = await response.json();

    console.log(
      "DONATION API STATUS:",
      response.status
    );

    console.log(
      "DONATION API RESPONSE:",
      data
    );

    // =========================================
    // API ERROR
    // =========================================

    if (!response.ok) {
      throw new Error(
        data.message || "Donation failed"
      );
    }

    console.log(
      "Donation saved:",
      data.donation
    );

    // =========================================
    // LOCAL STORAGE
    // =========================================

    const donation = {
      // Database ID if available
      id:
        data.donation?.id ||
        Date.now(),

      // Logged-in user
      userId: user.id,

      donorName:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.name || "User",

      donorEmail: user.email,

      role: "Donor",

      // Donation
      category: selectedCategory,

      ...form,

      images: imageData,

      status:
        data.donation?.status ||
        "Active",

      createdAt:
        data.donation?.createdAt ||
        new Date().toISOString(),
    };

    // Existing donations
    let oldDonations = [];

    try {
      oldDonations =
        JSON.parse(
          localStorage.getItem("donations") ||
            "[]"
        );
    } catch {
      oldDonations = [];
    }

    // Add newest donation first
    const updatedDonations = [
      donation,
      ...oldDonations,
    ];

    localStorage.setItem(
      "donations",
      JSON.stringify(updatedDonations)
    );

    // Dashboard update event
    window.dispatchEvent(
      new Event("donationsChanged")
    );

    setLoading(false);

    // =========================================
    // SUCCESS
    // =========================================

    await Swal.fire({
      icon: "success",

      title: "Donation Submitted!",

      html: `
        <p>Thank you for donating ❤️</p>

        <p style="margin-top:8px">
          Your <b>${selectedCategory}</b>
          donation has been successfully added
          to <b>My Donations</b>.
        </p>
      `,

      confirmButtonColor: "#15803d",

      confirmButtonText:
        "View My Donations",
    });

    router.push("/dashboard/donations");

  } catch (error) {
    console.error(
      "Donation API Error:",
      error
    );

    setLoading(false);

    Swal.fire({
      icon: "error",

      title: "Donation Failed",

      text:
        error.message ||
        "Unable to save donation.",

      confirmButtonColor: "#15803d",
    });
  }
};
  return (
    <>
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

      <main className="min-h-screen bg-gray-100 py-8">

        <div className="max-w-7xl mx-auto px-4">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">

            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

              <div>
                <h1 className="text-4xl font-bold">
                  <span className="text-green-700">
                    Donate
                  </span>{" "}
                  an Item
                </h1>

                <p className="text-gray-600 mt-2">
                  Give your unused items a new life.
                </p>

                {user && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                    <span className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                      {(
                        user.firstName ||
                        user.name ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <span className="text-green-800 font-semibold">
                      Donating as{" "}
                      {user.firstName || user.name || "User"}
                    </span>

                    <span className="text-xs bg-green-700 text-white px-2 py-1 rounded-full">
                      Donor
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden lg:flex items-center gap-4 bg-green-50 rounded-2xl shadow-md px-6 py-5">

                <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center">
                  <Gift
                    size={30}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Thank you for
                  </h3>

                  <p className="text-lg font-semibold text-gray-700">
                    choosing to donate
                  </p>

                  <p className="text-lg font-semibold text-gray-700">
                    and make a difference!
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* =========================================
              CATEGORY
          ========================================= */}

          <div className="bg-white rounded-2xl shadow p-6 mb-8">

            <h2 className="font-bold text-lg mb-5">
              Select Category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">

              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() =>
                    handleCategoryChange(cat.name)
                  }
                  className={`
                    border rounded-xl py-4
                    flex items-center justify-center
                    gap-2 duration-300
                    font-medium
                    ${
                      selectedCategory === cat.name
                        ? "bg-green-700 text-white border-green-700 shadow-md"
                        : "border-gray-400 hover:bg-green-50 hover:border-green-600"
                    }
                  `}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}

            </div>
          </div>

          {/* =========================================
              FORM
          ========================================= */}

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

              {/* =====================================
                  LEFT - ITEM DETAILS
              ===================================== */}

              <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Info className="text-green-700" />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Item Details
                  </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ITEM NAME */}

                  <Input
                    label="Item Name"
                    name="itemName"
                    value={form.itemName}
                    onChange={handleChange}
                    placeholder="Enter Item Name"
                    required
                  />

                  {/* BRAND */}

                  <Input
                    label="Brand (Optional)"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Brand Name"
                  />

                  {/* QUANTITY */}

                  <Input
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                    required
                  />

                  {/* CONDITION */}

                  <Select
                    label="Condition"
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    required
                    options={[
                      "New",
                      "Like New",
                      "Good",
                      "Used",
                      "Needs Repair",
                    ]}
                  />

                  {/* PRICE */}

                  <Input
                    label="Price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                  />

                  {/* ORIGINAL PRICE */}

                  <Input
                    label="Original Price"
                    name="originalPrice"
                    type="number"
                    value={form.originalPrice}
                    onChange={handleChange}
                    placeholder="Original Price"
                  />

                </div>

                {/* =====================================
                    CATEGORY SPECIFIC DETAILS
                ===================================== */}

                <div className="mt-8 border-t pt-7">

                  <h3 className="text-xl font-bold text-green-700 mb-5">
                    {selectedCategory} Details
                  </h3>

                  {/* CLOTHES */}

                  {selectedCategory === "Clothes" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                      <Select
                        label="Size"
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        required
                        options={[
                          "XS",
                          "S",
                          "M",
                          "L",
                          "XL",
                          "XXL",
                          "Free Size",
                        ]}
                      />

                      <Select
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                        options={[
                          "Men",
                          "Women",
                          "Boys",
                          "Girls",
                          "Unisex",
                        ]}
                      />

                      <Input
                        label="Material"
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        placeholder="Cotton, Denim..."
                      />

                    </div>
                  )}

                  {/* FOOD */}

                  {selectedCategory === "Food" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                      <Select
                        label="Food Type"
                        name="foodType"
                        value={form.foodType}
                        onChange={handleChange}
                        options={[
                          "Packaged Food",
                          "Fresh Food",
                          "Fruits",
                          "Vegetables",
                          "Cooked Food",
                          "Other",
                        ]}
                      />

                      <Input
                        label="Expiry Date"
                        name="expiryDate"
                        type="date"
                        value={form.expiryDate}
                        onChange={handleChange}
                      />

                      <Select
                        label="Packaging"
                        name="packaging"
                        value={form.packaging}
                        onChange={handleChange}
                        options={[
                          "Sealed",
                          "Box",
                          "Bottle",
                          "Packet",
                          "Open",
                        ]}
                      />

                    </div>
                  )}

                  {/* TOYS */}

                  {selectedCategory === "Toys" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <Select
                        label="Age Group"
                        name="ageGroup"
                        value={form.ageGroup}
                        onChange={handleChange}
                        options={[
                          "0-2 Years",
                          "3-5 Years",
                          "6-8 Years",
                          "9-12 Years",
                          "13+ Years",
                        ]}
                      />

                      <Input
                        label="Toy Type"
                        name="toyType"
                        value={form.toyType}
                        onChange={handleChange}
                        placeholder="Puzzle, Car, Doll..."
                      />

                    </div>
                  )}

                  {/* BOOKS */}

                  {selectedCategory === "Books" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                      <Input
                        label="Author"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Author Name"
                      />

                      <Input
                        label="Genre"
                        name="genre"
                        value={form.genre}
                        onChange={handleChange}
                        placeholder="Fiction, Education..."
                      />

                      <Input
                        label="Language"
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                        placeholder="English, Hindi..."
                      />

                    </div>
                  )}

                  {/* FURNITURE */}

                  {selectedCategory === "Furniture" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <Input
                        label="Dimensions"
                        name="dimensions"
                        value={form.dimensions}
                        onChange={handleChange}
                        placeholder="6 x 3 x 2 ft"
                      />

                      <Input
                        label="Material"
                        name="furnitureMaterial"
                        value={form.furnitureMaterial}
                        onChange={handleChange}
                        placeholder="Wood, Metal..."
                      />

                    </div>
                  )}

                  {/* ELECTRONICS */}

                  {selectedCategory === "Electronics" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                      <Input
                        label="Model"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        placeholder="Model Number"
                      />

                      <Input
                        label="Warranty"
                        name="warranty"
                        value={form.warranty}
                        onChange={handleChange}
                        placeholder="6 Months / No Warranty"
                      />

                      <Select
                        label="Power Source"
                        name="powerSource"
                        value={form.powerSource}
                        onChange={handleChange}
                        options={[
                          "Battery",
                          "Electric",
                          "USB",
                          "Solar",
                          "Other",
                        ]}
                      />

                    </div>
                  )}

                  {/* OTHERS */}

                  {selectedCategory === "Others" && (
                    <Input
                      label="Item Type"
                      name="itemType"
                      value={form.itemType}
                      onChange={handleChange}
                      placeholder="Enter item type"
                    />
                  )}

                </div>

                {/* DESCRIPTION */}

                <div className="mt-7">

                  <label className="font-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your item..."
                    className="w-full border border-gray-400 rounded-xl p-4 mt-2 outline-none focus:ring-2 focus:ring-green-600"
                  />

                </div>

                {/* =====================================
                    IMAGES
                ===================================== */}

                <div className="mt-7">

                  <label className="font-semibold">
                    Item Images
                  </label>

                  <label className="mt-2 border-2 border-dashed border-green-300 bg-green-50 rounded-xl p-7 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100">

                    <UploadCloud
                      size={40}
                      className="text-green-700"
                    />

                    <p className="font-semibold mt-2">
                      Upload Item Images
                    </p>

                    <p className="text-sm text-gray-500">
                      Maximum 5 images
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImages}
                    />

                  </label>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">

                      {imagePreviews.map(
                        (image, index) => (
                          <div
                            key={index}
                            className="relative"
                          >
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-28 object-cover rounded-xl border"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(index)
                              }
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>
              </div>

              {/* =====================================
                  RIGHT - PICKUP DETAILS
              ===================================== */}

              <div className="bg-white rounded-2xl shadow p-6 h-fit">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <MapPin className="text-green-700" />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Pickup Details
                  </h2>

                </div>

                <label className="font-semibold">
                  Full Address *
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter complete address"
                  className="w-full border border-gray-400 rounded-xl p-4 mt-2 mb-5 outline-none focus:ring-2 focus:ring-green-600"
                />

                <div className="grid grid-cols-2 gap-4">

                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />

                  <Input
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />

                  <Input
                    label="Preferred Date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                  />

                  <Input
                    label="Preferred Time (optional)"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                  />

                </div>

                {/* USER CONTACT */}

                {user && (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl">

                    <p className="text-sm text-gray-500">
                      Donor Account
                    </p>

                    <p className="font-bold">
                      {user.firstName || user.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      {user.email}
                    </p>

                  </div>
                )}

              </div>

            </div>

            {/* =====================================
                BUTTONS
            ===================================== */}

            <div className="bg-white rounded-2xl shadow p-6 mt-7 flex flex-col md:flex-row gap-4 justify-end">

              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 rounded-xl border border-gray-400 font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-green-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-800"
              >
                <Send size={19} />
                Submit Donation
              </button>

            </div>

          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* =====================================================
   INPUT COMPONENT
===================================================== */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="font-semibold">
        {label} {required && "*"}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-400 rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}

/* =====================================================
   SELECT COMPONENT
===================================================== */

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>
      <label className="font-semibold">
        {label} {required && "*"}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-400 rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-green-600 bg-white"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =====================================================
   IMAGE -> BASE64
===================================================== */

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
}