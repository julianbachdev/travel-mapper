import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

// Context for Cities
const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load cities from local storage on initial render
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
      setCities(storedCities);
    } catch {
      setError("There was an error loading cities...");
    }
    setIsLoading(false);
  }, []);

  // Get a specific city by ID
  const getCity = useCallback(
    (id) => {
      if (Number(id) === currentCity.id) return;

      setIsLoading(true);
      const city = cities.find((city) => city.id === Number(id));
      if (city) {
        setCurrentCity(city);
      } else {
        setError("City not found");
      }
      setIsLoading(false);
    },
    [cities, currentCity.id]
  );

  // Create a new city and store it in local storage
  const createCity = useCallback((newCity) => {
    setIsLoading(true);

    setCities((prevCities) => {
      const updatedCities = [...prevCities, newCity];
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      return updatedCities;
    });
    setCurrentCity(newCity);
    setIsLoading(false);
  }, []);

  // Delete a city and remove it from local storage
  const deleteCity = useCallback((cityName) => {
    setIsLoading(true);

    setCities((prevCities) => {
      const updatedCities = prevCities.filter(
        (city) => city.cityName !== cityName
      );
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      return updatedCities;
    });
    setCurrentCity({});
    setIsLoading(false);
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

// Custom hook to use Cities context
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
