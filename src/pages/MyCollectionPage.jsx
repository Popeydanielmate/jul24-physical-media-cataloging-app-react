import React, { useState, useEffect, useCallback } from 'react';
import vhsImage from '../assets/vhs.jpg';
import { getCollectionItems, getUserDetails, addCollectionItem } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MyCollectionPage({ token, setToken }) {
  const [items, setItems] = useState([]);
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [format, setFormat] = useState('');
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
    try {
      const user = await getUserDetails(token);
      setUsername(user.username);
      console.log('User details fetched successfully:', user); // Log user details
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }, [token]);

  const fetchCollectionItems = useCallback(async () => {
    try {
      const items = await getCollectionItems(token);
      setItems(items);
      console.log('Collection items fetched successfully:', items); // Log fetched items
    } catch (error) {
      console.error('Error fetching collection items:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      console.log('Fetching user details and collection items...');
      fetchUserDetails();
      fetchCollectionItems();
    }
  }, [token, navigate, fetchUserDetails, fetchCollectionItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Attempting to add item:', { title, artist, format });
    console.log('Title:', title, 'Artist:', artist, 'Format:', format);

    if (!title || !format) {
      console.error('Title and Format are required.');
      return;
    }

    try {
      console.log('Preparing to call addCollectionItem with token:', token);
      const newItem = await addCollectionItem({ title, artist, format }, token);
      console.log('Item added successfully:', newItem);

      setItems([...items, newItem]);
      setTitle('');
      setArtist('');
      setFormat('');
    } catch (error) {
      console.error('Error adding collection item:', error);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  return (
    <div className="collection-page-container">
      <h1>Welcome, {username}</h1>
      <div className="collection-image-container">
        <img src={vhsImage} alt="VHS" className="collection-image" />
      </div>
      <div className="collection-container">
        <h2>Add to Collection</h2>
        <form className="collection-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="format">Format</label>
            <select id="format" name="format" value={format} onChange={(e) => setFormat(e.target.value)} required>
              <option value="">Select Format</option>
              <option value="vinyl">Vinyl</option>
              <option value="cd">CD</option>
              <option value="dvd">DVD</option>
              <option value="blu-ray">Blu-ray</option>
              <option value="vhs">VHS</option>
              <option value="cassette">Cassette</option>
              <option value="boxset">Boxset</option>
            </select>
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="artist">Artist</label>
            <input
              type="text"
              id="artist"
              name="artist"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>
          <button type="submit" onClick={() => console.log('Button clicked')}>Add to Collection</button>
        </form>
        <ul className="collection-list">
          {items.map((item) => (
            <li key={item._id}>
              {item.title} {item.artist && `by ${item.artist}`} ({item.format})
            </li>
          ))}
        </ul>
      </div>
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
}
