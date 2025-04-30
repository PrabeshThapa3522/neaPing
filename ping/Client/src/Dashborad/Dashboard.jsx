import React, { useState, useEffect } from "react";
import axios from "axios";
// import { jwtDecode } from 'jwt-decode';  // Changed from default import to named import

const Dashboard = ({ collapsed }) => {



    // State for meetings
    const [meetings, setMeetings] = useState([]);
    const [newIp, setNewIp] = useState({ ip: "", name: "", province: "" });
    const [editingId, setEditingId] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
    const [showSessionAlert, setShowSessionAlert] = useState(false);

    // // Session expiration check
    // useEffect(() => {
    //     const checkTokenExpiration = () => {
    //         const token = localStorage.getItem("token");
    //         if (!token) return;

    //         try {
    //             const decodedToken = jwtDecode(token);
    //             const currentTime = Date.now() / 1000;

    //             if (decodedToken.exp < currentTime) {
    //                 handleSessionExpiration();
    //             }
    //         } catch (error) {
    //             console.error("Token decoding error:", error);
    //         }
    //     };

    //     // Initial check
    //     checkTokenExpiration();

    //     // Check every 60 seconds
    //     const interval = setInterval(checkTokenExpiration, 60000);

    //     return () => clearInterval(interval);
    // }, []);

    // const handleSessionExpiration = () => {
    //     localStorage.removeItem("token");
    //     setShowSessionAlert(true);
    // };

    // // Function to handle sorting by date
    // const handleSortByDate = () => {
    //     const newOrder = sortOrder === "asc" ? "desc" : "asc";
    //     setSortOrder(newOrder);

    //     const sortedMeetings = [...meetings].sort((a, b) => {
    //         const dateA = new Date(a.date);
    //         const dateB = new Date(b.date);

    //         if (newOrder === "desc") {
    //             return dateA - dateB; // Ascending order

    //         } else {
    //             return dateB - dateA; // Descending order
    //         }
    //     });
    //     setMeetings(sortedMeetings);
    // };


    const handleChange = (e) => {
        setNewIp({ ...newIp, [e.target.name]: e.target.value });
    };

    // // nepali date picker functionality
    // useEffect(() => {
    //     // Ensure default date is set on component mount
    //     setNewIp((prev) => ({ ...prev, date: todayBS }));
    // }, []); // Runs only once on mount


    // // const todayBS = ADToBS(new Date()); // Convert AD to BS
    // const todayBS = (new NepaliDate(new Date())).format('YYYY-MM-DD'); // Requires a JS Date object
    //     //   return bsDate.format('YYYY-MM-DD'); // Format as BS date string
    // const handleDateChange = (date) => {
    //     if (date < todayBS) {
    //         alert("Past Date cannot be selected!!");
    //         setNewIp((prev) => ({ ...prev, date: "" })); // Reset date to empty
    //     } else {
    //         setNewIp({ ...newIp, date });
    //     }
    // };

    // const convertADDateToBS = (adDate) => {
    //     try {
    //         // return ADToBS(adDate); // Convert AD to BS
    //          const bsDate = new NepaliDate(new Date(adDate));
    //          return bsDate.format('YYYY-MM-DD');
    //     } catch (error) {
    //         console.error("Error converting AD to BS:", error);
    //         return null;
    //     }
    // };

    // useEffect(() => {
    //     const fetchMeetings = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             const response = await fetch("http://localhost:5001/api/meetings", {
    //                 method: "GET", 
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //             if (!response.ok) throw new Error("Failed to fetch meetings");

    //             let data = await response.json();

    //             // Ensure valid meetings are sorted properly
    //             data = data.filter(meeting => meeting.date && meeting.time); // Remove invalid entries

    //             // Get today's date and last week's date in AD
    //             const todayAD = new Date();
    //             const monthAD = new Date();
    //             monthAD.setDate(todayAD.getDate() - 30); // Get the date 30 days ago

    //             // Convert both to BS
    //             const monthBS = convertADDateToBS(monthAD.toISOString().split("T")[0]); // Convert AD -> BS

    //             // Filter meetings that fall within the last 7 days in BS
    //             data = data.filter(meeting => {
    //                 return meeting.date >= monthBS; // Keep meetings within range
    //             });

    //             // Sort meetings by date (descending) and time (ascending)
    //             data.sort((a, b) => {
    //                 const dateA = new Date(a.date);
    //                 const dateB = new Date(b.date);

    //                 if (dateB - dateA !== 0) {
    //                     return dateB - dateA; // Sort by date (descending)
    //                 }

    //                 // Convert time to minutes for sorting
    //                 const [hourA, minuteA] = a.time.split(":").map(Number);
    //                 const [hourB, minuteB] = b.time.split(":").map(Number);

    //                 return hourA * 60 + minuteA - (hourB * 60 + minuteB); // Sort by time (ascending)
    //             });

    //             setMeetings(data);

    //         } catch (error) {
    //             console.error("Error fetching meetings:", error);
    //             setMeetings([]); // Prevent blank page
    //         }
    //     };

    //     fetchMeetings();
    //     const interval = setInterval(fetchMeetings, 1200000); // Fetch every 20min

    //     return () => clearInterval(interval); // Cleanup on unmount
    // }, []);


    // const handleEdit = (meeting) => {
    //     setNewIp({
    //         ...meeting,
    //         date: meeting.date.includes("T") ? meeting.date.split("T")[0] : meeting.date,  // Ensure a valid date is set
    //     });
    //     setEditingId(meeting._id);
    //     setIsFormVisible(true);
    // };

    const handleAddOrEditMeeting = async () => {
        
        if (!newIp.ip || !newIp.province || !newIp.name) {
            alert("Please fill in all required fields.");
            return;
        }

        const payload = {
            ip: newIp.ip.trim(),
            name: newIp.name.trim(),
            province: newIp.province.trim(),
        };

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token is missing or invalid. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let response;
            if (editingId) {
                // Update existing meeting
                response = await axios.put(`http://localhost:5001/api/ip/${editingId}`, payload, config);

                setMeetings((prevMeetings) =>
                    prevMeetings.map((meeting) =>
                        meeting._id === editingId ? response.data : meeting
                    )
                );


                setEditingId(null);
            } else {
                // Create new meeting
                response = await axios.post("http://localhost:5001/api/ip", payload, config);
                setMeetings((prevMeetings) => [response.data, ...prevMeetings]); // New meeting on top
            }

            setNewIp({
                ip: "",
                name: "",
                province: "",

            });

        } catch (error) {
            console.error("Error saving meeting:", error.response?.data || error.message);
            if (error.response?.status === 400) {
                alert("You already have a meeting scheduled at this time on this day.");
            }
        }
    };



    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this meeting?");
        if (!isConfirmed) return; // Stop execution if user cancels

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token is missing or invalid. Please log in again.");
                return;
            }

            await axios.delete(`http://localhost:5001/api/ip/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting._id !== id));
            console.log("Meeting deleted successfully");
        } catch (error) {
            console.error("Error deleting meeting:", error.response?.data || error.message);
        }
    };

    // // Pagination logic
    // const [currentPage, setCurrentPage] = useState(1);
    // const meetingsPerPage = 5;
    // const indexOfLastMeeting = currentPage * meetingsPerPage;
    // const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
    // const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

    // const totalPages = Math.ceil(meetings.length / meetingsPerPage);
    // const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    // const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // const formatDate = (date) => {
    //     const d = new Date(date);
    //     return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    // };

    return (
        <div className={` ${collapsed ? 'ml-[4.5rem]' : 'ml-[14rem]'} relative  transition-all duration-300 w-screen mt-20 flex justify-center`}>   {/* 'h-screen items-center', flex-1 allows dashboard component to occupy remaining spaces */}

            {/* Session Expiration Modal
            {showSessionAlert && (
                <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-4">⏳ Session Expired</h3>
                            <p className="mb-4">Your session has expired. Please log in again.</p>
                            <button
                                // onClick={() => {
                                //     localStorage.removeItem("token");
                                //     window.location.href = "/";
                                // }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            <div className={` flex flex-wrap justify-center
                                p-[1vw] md:p-[2rem]
                                w-[40vw] md:w-[30vw] lg:w-[30vw] xl:w-[30vw]
                                bg-gray-700 border-1 relative`}>

                <h2 className="text-xl pb-4 flex justify-center font-sans text-white  mb-4">Add IP </h2>

                <input
                    type="text"
                    name="ip"
                    placeholder="Ip Address"
                    value={newIp.ip}
                    onChange={handleChange}
                    autoComplete="off"
                    className="border outline-white text-white p-2 w-full mb-2"
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newIp.name}
                    onChange={handleChange}
                    autoComplete="off"
                    className="border outline-white text-white p-2 w-full mb-2"
                />
                <select
                    name="province"
                    className="border outline-white bg-gray-700 text-white p-2 w-full mb-2"
                    onChange={handleChange}
                >
                     <option value="">-- Select Province --</option>
                    <option value="province-1">Province 1</option>
                    <option value="province-2">Province 2</option>
                    <option value="province-3">Province 3</option>
                    <option value="province-4">Province 4</option>
                    <option value="province-5">Province 5</option>
                    <option value="province-6">Province 6</option>
                    <option value="province-7">Province 7</option>
                </select>


                <button
                    onClick={handleAddOrEditMeeting}
                    disabled={!newIp.name || !newIp.ip || !newIp.province}
                    className={`px-4 py-2 mt-4 rounded-md w-full ${!newIp.ip || !newIp.name || !newIp.province
                        ? "bg-gray-400 cursor-not-allowed"
                        : editingId !== null
                            ? "bg-yellow-500" // Update Meeting (Yellow)
                            : "bg-green-500" // Add Meeting (Green)
                        }`}
                >
                    {editingId !== null ? "Update Meeting" : "Add Meeting"}
                </button>
            </div>


        </div>
    );
};

export default Dashboard;
