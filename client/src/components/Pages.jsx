import React, {useContext} from 'react';
import {Pagination} from "react-bootstrap";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";

const Pages = observer(() => {
    const {thing} = useContext(Context)
    const pageCount = Math.ceil(thing.totalCount / thing.limit)
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    return (
        <Pagination className="ml-8 mt-5">
            {pages.map(page =>
                <Pagination.Item key={page} active={thing.page === page} onClick={() => thing.setPage(page)}>{page}</Pagination.Item>
            )}
        </Pagination>
    );
});

export default Pages;