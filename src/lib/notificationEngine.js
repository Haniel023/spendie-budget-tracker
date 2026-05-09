export const createNotification = async ({
  supabase,
  userId,
  title,
  message,
  type = "info",
}) => {
  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        title,
        message,
        type,
      },
    ]);

  if (error) {
    console.log(error);
  }
};