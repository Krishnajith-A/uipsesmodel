import { useState } from "react";
import axios from "axios";
// import React from "react";
import NavbarNext from "./components/Navbar.jsx";

import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Chip,
} from "@nextui-org/react";
function App() {
  // const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [responselinks, setResponselinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [iduser, setIduser] = useState("2");

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/search", {
        searchterm: search,
        userid: iduser,
      });
      setResponselinks(response.data.sortedResults);
      console.log(response.data.sortedResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handleCardclick = async (title, categories) => {
    try {
      let wikipedia = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        title
      )}`;
      const response = await axios.post("http://localhost:3000/api/update", {
        title: title,
        categories: categories,
        userid: iduser,
      });
      console.log(response);
      window.open(wikipedia, "_blank");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="min-h-screen">
        <NavbarNext />

        <div className="w-full flex justify-center gap-10">
          <Chip
            className="cursor-pointer"
            color="warning"
            variant={iduser === "1" ? "solid" : "bordered"}
            onClick={() => setIduser("1")}
          >
            {" "}
            JoJo
          </Chip>
          <Chip
            className="cursor-pointer"
            color="warning"
            variant={iduser === "2" ? "solid" : "bordered"}
            onClick={() => setIduser("2")}
          >
            {" "}
            Jithu
          </Chip>
          <Chip
            className="cursor-pointer"
            color="warning"
            variant={iduser === "3" ? "solid" : "bordered"}
            onClick={() => setIduser("3")}
          >
            Abhijith
          </Chip>
        </div>
        <div className="w-full flex align-middle gap-4 justify-center p-4">
          <Input
            type="text"
            label="Search here"
            variant="bordered"
            defaultValue={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            className="max-w-xl max-h-xl"
          />
          <Button color="primary" size="lg" onClick={handleSearch}>
            Search
          </Button>
        </div>
        {loading ? (
          <div className="w-full flex justify-center items-center">
            <Spinner color="primary" size="lg" className="m-10" />
          </div>
        ) : (
          <>
            {responselinks && search && (
              <div className="w-full flex justify-center items-center flex-col">
                {responselinks.map((item, index) => (
                  <Card className="max-w-3xl p-3 m-3" key={index} shadow>
                    <CardHeader
                      className="text-blue-500 hover:text-blue-700 hover:underline text-xl"
                      onClick={() =>
                        handleCardclick(item.title, item.categories)
                      }
                    >
                      {item.title}
                    </CardHeader>
                    <CardBody>
                      {" "}
                      <div dangerouslySetInnerHTML={{ __html: item.snippet }} />
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
