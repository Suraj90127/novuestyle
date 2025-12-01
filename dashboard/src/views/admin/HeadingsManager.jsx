import React from 'react';
import Headings from './Headings';
import Heading2Manager from './Heading2Manager';
import Heading3Manager from './Heading3Manager';
import Heading4Manager from './Heading4Manager';
import Heading5Manager from './Heading5Manager';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';



const Heading = () => {
  const dispatch = useDispatch()
    useEffect(() => {
      const obj = { parPage: 10000, page: 1, searchValue: "" };
      dispatch(get_category(obj));
    }, [dispatch]);
  return (
    <div style={{ padding: '20px' }}>
      {/* Section for Heading 1 */}
      <section style={{ marginBottom: '30px' }}>
        <Headings />
      </section>

      {/* Section for Heading 2 */}
      <section>
        <Heading2Manager />
      </section>
      <section>
        <Heading3Manager />
      </section>
      <section>
        <Heading4Manager />
      </section>
      <section>
        <Heading5Manager />
      </section>

    </div>
  );
};

export default Heading;
