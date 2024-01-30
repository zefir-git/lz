import "./style.css";
import HomePage from "./page/HomePage.ts";
import Page from "./page/Page.ts";
import CrcRevisePage from "./page/CrcRevisePage.ts";

Page.app = document.querySelector("#app");
Page.add(new HomePage(), new CrcRevisePage());
Page.open();
