import './Spinner.css';
const Spinner = () => {
  return (
    <div className="flex mt-4">
      <div className="custom-pulse">
        <div className="custom-pulser"></div>
      </div>
    </div>
  );
};

export default Spinner;
