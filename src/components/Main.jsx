import { useState, useEffect, useRef } from "react"
import { Heart } from "lucide-react"
import { galleryData } from "../gallery"





/**
 * The main component of the app, which renders the profile information,
 * post creation form, and gallery of posts.
 *
 * @returns {ReactElement} The main component of the app.
 */
export default function Main() {
  // State for profile information
  const [profileInfo, setProfileInfo] = useState({
    name: "Aliaune Damala Bouga Time Bongo Puru Nacka Lu Lu Lu Badara Akon...",
    bio: "Known mononymously as Akon (/'e&#618k&#594n/), is a Senegalese-American singer,record producer, and entrepreneur. An influential figure in modern world....",
    image: "./images/Avatar.jpg",
  })

  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newPostModalOpen, setNewPostModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewData, setPreviewData] = useState({ src: "", title: "" })

  // State for form inputs
  const [formInputs, setFormInputs] = useState({
    username: "",
    bio: "",
    profileImage: null,
  })

  // State for new post
  const [newPost, setNewPost] = useState({
    caption: "",
    image: null,
  })

  // State for gallery items
  const [galleryItems, setGalleryItems] = useState([])

  // Refs for file inputs
  const profileImageRef = useRef(null)
  const postImageRef = useRef(null)

  // Load gallery data on component mount
  useEffect(() => {
    setGalleryItems(
      galleryData.map((item) => ({
        ...item,
        isLiked: false,
      })),
    )
  }, [])

  // Handle edit profile form submission
  const handleEditProfileSubmit = (e) => {
    e.preventDefault()

    const updatedProfile = { ...profileInfo }

    if (formInputs.username.trim()) {
      updatedProfile.name = formInputs.username
    }

    if (formInputs.bio.trim()) {
      updatedProfile.bio = formInputs.bio
    }

    if (formInputs.profileImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        updatedProfile.image = e.target.result
        setProfileInfo(updatedProfile)
      }
      reader.readAsDataURL(formInputs.profileImage)
    } else {
      setProfileInfo(updatedProfile)
    }

    setEditModalOpen(false)
    setFormInputs({ username: "", bio: "", profileImage: null })
  }

  // Handle new post form submission
  const handleNewPostSubmit = (e) => {
    e.preventDefault()

    if (!newPost.caption.trim()) {
      alert("Please enter a caption for your post.")
      return
    }

    if (newPost.image) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newGalleryItem = {
          img: e.target.result,
          title: newPost.caption,
          isLiked: false,
          icon: `<svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>`,
        }

        setGalleryItems([...galleryItems, newGalleryItem])
      }
      reader.readAsDataURL(newPost.image)
    }

    setNewPostModalOpen(false)
    setNewPost({ caption: "", image: null })
  }

  // Handle heart icon click (like/unlike)
  const handleLikeToggle = (index) => {
    const updatedGalleryItems = [...galleryItems]
    updatedGalleryItems[index].isLiked = !updatedGalleryItems[index].isLiked
    setGalleryItems(updatedGalleryItems)
  }

  // Handle opening preview modal
  const handleOpenPreview = (src, title) => {
    setPreviewData({ src, title })
    setPreviewModalOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormInputs({
      ...formInputs,
      [name]: value,
    })
  }

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormInputs({
        ...formInputs,
        profileImage: e.target.files[0],
      })
    }
  }

  // Handle new post input changes
  const handlePostInputChange = (e) => {
    const { name, value } = e.target
    setNewPost({
      ...newPost,
      [name]: value,
    })
  }

  // Handle new post image change
  const handlePostImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({
        ...newPost,
        image: e.target.files[0],
      })
    }
  }

  // Close modals when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setEditModalOpen(false)
        setNewPostModalOpen(false)
        setPreviewModalOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  return (
    <main>
      <section className="first-section">
        <div className="profile-section">
          <div className="left-section">
            <img src={profileInfo.image || "/placeholder.svg"} alt="profile" className="profile-img" />
          </div>

          <div className="profile-text">
            <h3 className="heading-text">{profileInfo.name}</h3>
            <p className="profile-parag">{profileInfo.bio}</p>
            <button title="edit" className="edit-icon" onClick={() => setEditModalOpen(true)}>
              <i className="fa-solid fa-pencil"></i> Edit Profile
            </button>
          </div>
        </div>

        <button className="post" onClick={() => setNewPostModalOpen(true)}>
          <i className="fa-solid fa-plus"></i> New post
        </button>
      </section>

      {/* Edit profile modal */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setEditModalOpen(false)}>
              &times;
            </span>
            <h2>Edit Profile</h2>
            <form className="modal-form" onSubmit={handleEditProfileSubmit}>
              <div>
                <label htmlFor="username">Name:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formInputs.username}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="bio">Bio:</label>
                <textarea id="bio" name="bio" rows="4" value={formInputs.bio} onChange={handleInputChange}></textarea>
              </div>

              <div>
                <label htmlFor="profileImage">Upload New Image:</label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  ref={profileImageRef}
                  onChange={handleProfileImageChange}
                />
              </div>

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* New post modal */}
      {newPostModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setNewPostModalOpen(false)}>
              &times;
            </span>
            <h2>New Post</h2>
            <form className="modal-form" onSubmit={handleNewPostSubmit}>
              <div>
                <label htmlFor="postImage">Upload Image:</label>
                <input
                  type="file"
                  id="postImage"
                  accept="image/*"
                  required
                  ref={postImageRef}
                  onChange={handlePostImageChange}
                />
              </div>

              <div>
                <label htmlFor="postCaption">Caption:</label>
                <textarea
                  id="postCaption"
                  name="caption"
                  rows="4"
                  minLength="2"
                  maxLength="50"
                  value={newPost.caption}
                  onChange={handlePostInputChange}
                ></textarea>
              </div>

              <button type="submit">Create Post</button>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setPreviewModalOpen(false)}>
              &times;
            </span>
            <img id="preview-image" src={previewData.src || "/placeholder.svg"} alt="Preview Image" />
            <p id="preview-title">{previewData.title}</p>
          </div>
        </div>
      )}

      <hr className="post-hr" />

      <section className="gallery">
        {galleryItems.map((item, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={item.img || "/placeholder.svg"}
              alt={item.title}
              className="gallery-image"
              onClick={() => handleOpenPreview(item.img, item.title)}
            />
            <div className="gallery-caption">
              <span>{item.title}</span>
              <div onClick={() => handleLikeToggle(index)} style={{ cursor: "pointer" }}>
                <Heart fill={item.isLiked ? "red" : "none"} stroke={item.isLiked ? "red" : "currentColor"} size={24} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <br />
      <hr className="line" />
    </main>
  )
}
