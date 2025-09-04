export const addPointsForUser = async (username: string): Promise<number> => {
  if (!process.env.BACKEND_API_URL) {
    throw new Error("BACKEND_API_URL is not set");
  }

  if (!process.env.BACKEND_API_KEY) {
    throw new Error("BACKEND_API_KEY is not set");
  }

  // Accept: "application/json",
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/addpoints/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add points: ${response.status} ${response.statusText}`);
    }

    const pointsText = await response.text();
    return Number(pointsText);
  } catch (error) {
    console.error("Error adding points for user:", username, error);
    throw error;
  }
};
