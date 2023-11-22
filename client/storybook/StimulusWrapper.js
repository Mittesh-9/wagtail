"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StimulusWrapper = void 0;
const react_1 = __importDefault(require("react"));
const initStimulus_1 = require("../src/includes/initStimulus");
/**
 * Wrapper around the Stimulus application to ensure that the application
 * is scoped to only the specific story instance's DOM and also ensure
 * that the hot-reloader / page switches to not re-instate new applications
 * each time.
 *
 * @example
 * import { StimulusWrapper } from '../storybook/StimulusWrapper';
 * const Template = ({ debug }) =>
 *   <StimulusWrapper
 *     definitions={[{ controllerConstructor: SubmitController, identifier: 'w-something' }]}
 *     debug={debug}
 *   >
 *     <form data-controller="w-something" />
 *   </StimulusWrapper>
 */
class StimulusWrapper extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.ref = react_1.default.createRef();
    }
    componentDidMount() {
        const { debug = false, definitions = [] } = this.props;
        const element = this.ref.current || document.documentElement;
        this.application = (0, initStimulus_1.initStimulus)({ debug, definitions, element });
    }
    componentDidUpdate({ debug: prevDebug }) {
        const { debug } = this.props;
        if (debug !== prevDebug) {
            Object.assign(this.application, { debug });
        }
    }
    componentWillUnmount() {
        if (!this.application)
            return;
        this.application.stop();
        delete this.application;
    }
    render() {
        const { children } = this.props;
        return <div ref={this.ref}>{children}</div>;
    }
}
exports.StimulusWrapper = StimulusWrapper;
