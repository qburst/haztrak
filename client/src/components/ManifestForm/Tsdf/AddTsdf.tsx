import { HtModal } from 'components/Ht';
import { HandlerSearchForm } from 'components/ManifestForm/HandlerSearch';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { HandlerType } from 'types/handler';

interface Props {
  handleClose: () => void;
  show: boolean | undefined;
}

/**
 * Returns a modal that wraps around the HandlerSearchForm for adding the manifest TSDF
 * @param show
 * @param handleClose
 * @constructor
 */
function AddTsdf({ show, handleClose }: Props) {
  return (
    <HtModal showModal={show ? show : false} handleClose={handleClose}>
      <HtModal.Header closeButton>
        <Col>
          <Row>
            <HtModal.Title title="Add Designated Facility" />
          </Row>
          <Row>
            <i>
              <small>The Treatment, Storage, or Disposal Facility the waste will shipped to.</small>
            </i>
          </Row>
        </Col>
      </HtModal.Header>
      <HtModal.Body>
        <HandlerSearchForm handleClose={handleClose} handlerType={HandlerType.Tsd} />
      </HtModal.Body>
    </HtModal>
  );
}

export default AddTsdf;
