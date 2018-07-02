import React from 'react';

export function scroller(props) {
    return <div className="CustomScrollbar-scroller" { ...props } />;
}

export function trackVertical(props) {
    return <div className="CustomScrollbar-track CustomScrollbar-trackVertical"  { ...props } />;
}

export function trackHorizontal(props) {
    return <div className="CustomScrollbar-track CustomScrollbar-trackHorizontal"  { ...props } />;
}

export function thumbVertical(props) {
    return <div className="CustomScrollbar-thumb CustomScrollbar-thumbVertical"  { ...props } />;
}

export function thumbHorizontal(props) {
    return <div className="CustomScrollbar-thumb CustomScrollbar-thumbHorizontal" { ...props } />;
}