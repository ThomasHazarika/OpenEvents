import ExcelJS from "exceljs";
import Event from "../models/event.js";

const exportEventsToExcel = async (req, res) => {
  const events = await Event.find({ platform: "Unstop" });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Unstop Events");

  sheet.columns = [
    { header: "Title", key: "title", width: 40 },
    { header: "Location", key: "location", width: 20 },
    { header: "Deadline", key: "deadline", width: 20 },
    { header: "Link", key: "link", width: 50 },
  ];

  events.forEach((event) => {
    sheet.addRow({
      title: event.title,
      location: event.location,
      deadline: event.deadline,
      link: event.link,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=unstop_events.xlsx",
  );

  await workbook.xlsx.write(res);
  res.end();
};

export { exportEventsToExcel };
