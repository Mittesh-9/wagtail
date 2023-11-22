"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentHeader = void 0;
const react_1 = __importStar(require("react"));
const gettext_1 = require("../../../../utils/gettext");
const Icon_1 = __importDefault(require("../../../Icon/Icon"));
const dateOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
};
const dateTimeFormat = new Intl.DateTimeFormat([], dateOptions);
const CommentHeader = ({ commentReply, store, onResolve, onEdit, onDelete, descriptionId, focused, }) => {
    const { author, date } = commentReply;
    const onClickResolve = (e) => {
        e.preventDefault();
        if (onResolve) {
            onResolve(commentReply, store);
        }
    };
    const onClickEdit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (onEdit) {
            onEdit(commentReply, store);
        }
    });
    const onClickDelete = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (onDelete) {
            onDelete(commentReply, store);
        }
    });
    const [menuOpen, setMenuOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (menuOpen && !focused) {
            setMenuOpen(false);
        }
    }, [focused]);
    const menuRef = (0, react_1.useRef)(null);
    const menuContainerRef = (0, react_1.useRef)(null);
    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };
    (0, react_1.useEffect)(() => {
        if (menuOpen) {
            setTimeout(() => { var _a; return (_a = menuRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 1);
        }
    }, [menuOpen]);
    const handleClickOutside = (e) => {
        if (menuContainerRef.current &&
            e.target instanceof Node &&
            !menuContainerRef.current.contains(e.target)) {
            setMenuOpen(false);
        }
    };
    (0, react_1.useEffect)(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
    const dateISO = new Date(date).toISOString();
    return (<div className="comment-header">
      <div className="comment-header__actions">
        {(onEdit || onDelete || onResolve) && (<div className="comment-header__action comment-header__action--more" ref={menuContainerRef}>
            <details open={menuOpen} onClick={toggleMenu}>
              <summary aria-label={(0, gettext_1.gettext)('More actions')} aria-haspopup="menu" role="button" onClick={toggleMenu} aria-expanded={menuOpen}>
                <Icon_1.default name="dots-horizontal"/>
              </summary>

              <div className="comment-header__more-actions" role="menu" ref={menuRef}>
                {onEdit && (<button type="button" role="menuitem" onClick={onClickEdit}>
                    {(0, gettext_1.gettext)('Edit')}
                  </button>)}
                {onDelete && (<button type="button" role="menuitem" onClick={onClickDelete}>
                    {(0, gettext_1.gettext)('Delete')}
                  </button>)}
                {onResolve && (<button type="button" role="menuitem" onClick={onClickResolve}>
                    {(0, gettext_1.gettext)('Resolve')}
                  </button>)}
              </div>
            </details>
          </div>)}
      </div>
      {author && author.avatarUrl && (<img className="comment-header__avatar" src={author.avatarUrl} alt="" decoding="async" loading="lazy"/>)}
      <span id={descriptionId}>
        <p className="comment-header__author">{author ? author.name : ''}</p>
        <p className="comment-header__date">
          <time dateTime={dateISO}>{dateTimeFormat.format(date)}</time>
        </p>
      </span>
    </div>);
};
exports.CommentHeader = CommentHeader;
