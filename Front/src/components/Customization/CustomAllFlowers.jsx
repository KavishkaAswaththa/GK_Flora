// import React, { useEffect, useState } from "react";
// import FlowerCard from "./FlowerCard";
// import axios from "axios";

// export default function AllFlowers() {
//   const [flowers, setFlowers] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/flowers")
//       .then((res) => {
//         setFlowers(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching flowers:", err);
//       });
//   }, []);

//   return (
//     <div className="flower-grid">
//       {flowers.map((flower) => (
//         <FlowerCard
//           key={flower.id}
//           name={flower.name}
//           image={
//             flower.image
//               ? `data:image/jpeg;base64,${flower.image}`
//               : null
//           }
//         />
//       ))}
//     </div>
//   );
// }
