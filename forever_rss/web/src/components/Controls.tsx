import {Area} from "../styles";
import ControlsContent from "./ControlsContent";
import {useSwipeable} from "react-swipeable";
import Header from "./Header";
import {useAppMode} from "../contexts/AppModeContext";
import Footer from "./Footer";

export default function Controls() {
    const {mode, handleBack} = useAppMode();

    const handlers = useSwipeable({onSwipedRight: handleBack});

    const refPassthrough = (el: any) => {
        handlers.ref(el);
    }

    return (
        <Area tabIndex={-1} ref={refPassthrough}>
            <Header mode={mode} handleBack={handleBack}/>
            <ControlsContent mode={mode}/>
            <Footer/>
        </Area>
    );
}
