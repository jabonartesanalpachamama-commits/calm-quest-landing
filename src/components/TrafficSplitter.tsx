import { useState, useEffect } from "react";
import FreeClass from "@/pages/FreeClass";
import FreeClassTime from "@/pages/FreeClassTime";
import FreeClassSlots from "@/pages/FreeClassSlots";

type Variant = "A" | "B" | "C";

const TrafficSplitter = () => {
    const [variant, setVariant] = useState<Variant | null>(null);

    useEffect(() => {
        // Check if user already has a variant assigned
        const storedVariant = localStorage.getItem("freeClassVariant");

        if (storedVariant && ["A", "B", "C"].includes(storedVariant)) {
            setVariant(storedVariant as Variant);
        } else {
            // Assign new variant with 33.33% probability for each
            const random = Math.random();
            let newVariant: Variant;

            if (random < 1 / 3) {
                newVariant = "A";
            } else if (random < 2 / 3) {
                newVariant = "B";
            } else {
                newVariant = "C";
            }

            localStorage.setItem("freeClassVariant", newVariant);
            setVariant(newVariant);
        }
    }, []);

    if (!variant) {
        return null; // or a loading spinner
    }

    switch (variant) {
        case "A":
            return <FreeClass />;
        case "B":
            return <FreeClassTime />;
        case "C":
            return <FreeClassSlots />;
        default:
            return <FreeClass />;
    }
};

export default TrafficSplitter;
