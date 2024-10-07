import setupToolbar from "./toolbar";
import setupOutlineNavigation from "./features/outline_navigator";
import setupZoomSlider from "./features/zoom_slider";
import setupKeyboard from "./features/keyboard";
import { haddleNavbar } from "./features/navbar";
import "./features/queries";

setupToolbar();
setupOutlineNavigation();
setupZoomSlider();
setupKeyboard();
haddleNavbar();

