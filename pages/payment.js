import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { carList } from "../data/carList";
import { bikeList } from "../data/bikeList";

import { Alert } from "@mantine/core";
import { Car } from "tabler-icons-react";

import tw from "tailwind-styled-components/dist/tailwind";

const Payment = () => {
  const [cvv, setCVV] = useState();
  const router = useRouter();
  const [zip, setZip] = useState();
  const [suc, setSuc] = useState();
  const [card, setCard] = useState();
  const [date1, setDate1] = useState();
  const [date2, setDate2] = useState();
  const { ride, id, member, price, book } = router.query;
  var vehicleList;
  if (ride == "car") {
    vehicleList = carList;
  } else {
    vehicleList = bikeList;
  }
  const handleSubmit = () => {
    if (!cvv || !zip || !card || !date1 || !date2) {
      alert("Provide all details");
    } else {
      const newList = vehicleList.filter((vehicle) => {
        const newVehicle = vehicle;

        if (vehicle.id == parseInt(id)) {
          if (vehicle.remainingSeat < 1) {
            alert("Not more seat availablop");
            router.push("/");
            return;
          }
          vehicle.remainingSeat = vehicle.remainingSeat - member;
        }
        return newVehicle;
      });
      fetch("/api/car", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      })
        .then((data) => console.log("s", data))
        .catch((e) => console.log("eeeeeeee", e));

      setSuc(true);
    }
  };
  return (
    <div className="font-mono ">
      <header className="bg-black h-20 text-white font-bold text-3xl font-mono p-5">
        <h2>Pahiya</h2>
      </header>
      <body className="   flex justify-center bg-gray-100 w-full h-screen">
        <div className="md:w-2/5 w-3/5 h-4/5  my-5 relative z-10 bg-white p-4 rounded-lg shadow-xl">
          <p className="text-center text-2xl text-gray-500 font-light">
            Checkout
          </p>
          <div className="absolute text-sm w-20 h-20 rounded-full bg-green-400  text-white top-3 right-10 z-40 shadow-xl font-semibold hover:bg-green-600">
            <p className="flex justify-center items-center w-full h-full z-50">
              ₹{price}
            </p>
          </div>
          <div className="">
            <div className="flex flex-col gap-2 mx-4 my-8">
              <label htmlFor="card" className=" text-gray-400">
                Card number
              </label>
              <input
                type="number"
                className=" outline-none border-gray-200 border py-2 px-3 rounded-lg focus:border-blue-500 text-gray-500"
                id="card"
                minLength={16}
                onChange={(e) => setCard(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 mx-4 my-8">
              <label htmlFor="expiry" className=" text-gray-400">
                Expiry Date
              </label>
              <div className="flex  gap-10">
                <input
                  type="number"
                  className=" outline-none border-gray-200 border py-2 px-3  rounded-lg focus:border-blue-500 text-gray-500"
                  id="expiry"
                  onChange={(e) => setDate1(e.target.value)}
                />
                <input
                  type="number"
                  className=" outline-none border-gray-200 border py-2 px-3  rounded-lg focus:border-blue-500 text-gray-500"
                  id="card"
                  onChange={(e) => setDate2(e.target.value)}
                />
              </div>
            </div>
            <div className="flex  gap-10 m-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="cvv" className=" text-gray-400">
                  CVV
                </label>
                <input
                  type="number"
                  className=" outline-none border-gray-200 border py-2 px-3  rounded-lg focus:border-blue-500 text-gray-500"
                  id="cvv"
                  onChange={(e) => setCVV(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="zip" className=" text-gray-400">
                  ZIP code
                </label>
                <input
                  type="number"
                  className=" outline-none border-gray-200 border py-2 px-3  rounded-lg focus:border-blue-500 text-gray-500"
                  id="zip"
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
            <div className="my-5">
              <p className="text-gray-400  text-center px-10">
                If you don&apos;t end you subscription before the trial end on
                December 30, 2030 , you agree that you automatically be charged.
              </p>
            </div>
          </div>

          <div className="hover:bg-green-600  bg-green-400">
            <button
              className="w-full  p-4 font-bold text-white text-center  hover:bg-green-600 z-40"
              onClick={handleSubmit}
            >
              {suc
                ? "Payment Succesfull"
                : `Pay  ₹ 
                ${price}`}
            </button>
          </div>

          {suc && (
            <Alert
              className="text-2xl font-bold"
              icon={<Car size={16} />}
              title={book ? "Your ride is booked" : "Your Ride Is On The Way!"}
              radius="md"
              withCloseButton
              size="100"
              onClose={() => {
                setSuc(false);
                router.push("/");
              }}
            ></Alert>
          )}
        </div>
      </body>
    </div>
  );
};

export default Payment;
const UserImage = tw.img`w-42 h-32`;

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { carList } from "../data/carList";
// import { bikeList } from "../data/bikeList";
// import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
// import { auth } from "../firebase";

// import { Alert } from "@mantine/core";
// import { Car } from "tabler-icons-react";

// import tw from "tailwind-styled-components/dist/tailwind";

// const Payment = () => {
//   const [email, setEmail] = useState("");
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState();
//   const [suc, setSuc] = useState(false);
//   const { ride, id, member, distance, price } = router.query;
//   var vehicleList;
//   if (ride == "car") {
//     vehicleList = carList;
//   } else {
//     vehicleList = bikeList;
//   }
//   useEffect(() => {
//     return onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // console.log(auth.getInstance);
//         setUser({
//           name: user.displayName,
//           photoUrl: user.photoURL,
//         });
//       } else {
//         setUser(null);
//         router.push("/login");
//       }
//     });
//   }, [router, user]);

//   const handleSubmit = () => {
//     const newList = vehicleList.filter((vehicle) => {
//       const newVehicle = vehicle;

//       if (vehicle.id == parseInt(id)) {
//         if (vehicle.remainingSeat < 1) {
//           alert("Not more seat availablop");
//           router.push("/");
//           return;
//         }
//         vehicle.remainingSeat = vehicle.remainingSeat - member;
//       }
//       return newVehicle;
//     });
//     fetch("/api/car", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newList),
//     })
//       .then((data) => console.log("s", data))
//       .catch((e) => console.log("eeeeeeee", e));

//     setSuc(true);
//   };
//   return (
//     <div className="font-mono">
//       <header className="bg-black h-20 text-white font-bold text-3xl font-mono p-5">
//         <h2>Pahiya</h2>
//       </header>
//       <body className="w-full bg-gray-200 h-screen">
//         <div className="md:w-1/2  mx-auto  mt-5 ">
//           <h1 className="text-center text-2xl font-semibold">
//             Your Information
//           </h1>
//           <div className="mt-5 flex border-2 border-black justify-around  flex-col p-4 gap text-lg">
//             <p> Name : {user?.name}</p>
//             <p>Total Member : {member}</p>
//             <p>Distance : {distance}km</p>
//             <p>Cab Fare : ₹{price}</p>
//             <p>GST : ₹10</p>
//             <p>Total price : ₹{parseInt(price) * parseInt(member) + 10}</p>
//           </div>
//           <div className="border-2 border-black my-5">
//             <h1 className="text-center text-2xl font-semibold mt-3 ">Ride</h1>
//             {vehicleList.map((vehicle) => {
//               if (vehicle.id == parseInt(id)) {
//                 return (
//                   <div className="flex items-center justify-around">
//                     <div className="flex gap-2 flex-col items-center">
//                       <UserImage
//                         key={vehicle.id}
//                         src={vehicle.imgUrl}
//                         alt="vehicle"
//                         width={150}
//                         height={100}
//                       ></UserImage>

//                       <span className="font-semibold text-lg">
//                         {vehicle.service}
//                       </span>
//                     </div>
//                     <span>
//                       Seat Available :{" "}
//                       <span className="text-green-400 text-xl">
//                         {vehicle.remainingSeat}
//                       </span>
//                     </span>
//                   </div>
//                 );
//               }
//             })}
//           </div>
//           <div className="border-2 border-black">
//             <button
//               className="w-full bg-green-700 p-4 font-bold text-white text-center  hover:bg-green-600 z-40"
//               onClick={handleSubmit}
//             >
//               {suc
//                 ? "Payment Succesfull"
//                 : `Click to pay  ₹
//                 ${parseInt(price) * parseInt(member) + 10}`}
//             </button>
//           </div>

//           {suc && (
//             <Alert
//               className="text-2xl font-bold"
//               icon={<Car size={16} />}
//               title="Your Ride Is On The Way!"
//               radius="md"
//               withCloseButton
//               size="100"
//               onClose={() => {
//                 setSuc(false);
//                 router.push("/");
//               }}
//             ></Alert>
//           )}
//         </div>
//       </body>
//     </div>
//   );
// };

// export default Payment;
// const UserImage = tw.img`w-42 h-32`;
