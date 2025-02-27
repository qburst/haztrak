import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtForm } from 'components/Ht';
import React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ManifestHandler, Transporter } from 'types/handler';
import { QuickerSignature } from 'types/manifest/signatures';
import { useNavigate } from 'react-router-dom';
import { addMsg, RootState, useAppDispatch, useAppSelector } from 'store';
import { UserState } from 'types/store';
import htApi from 'services';
import { AxiosError, AxiosResponse } from 'axios';

interface QuickerSignProps {
  mtn: Array<string>;
  mtnHandler: ManifestHandler | Transporter;
  siteType: 'Generator' | 'Transporter' | 'Tsdf';
  handleClose?: () => void;
}

function QuickerSignForm({ mtn, mtnHandler, handleClose, siteType }: QuickerSignProps) {
  const { user } = useAppSelector<UserState>((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, setValue } = useForm<QuickerSignature>({
    defaultValues: {
      printedSignatureName: user,
      printedSignatureDate: new Date().toISOString().slice(0, -8),
    },
  });
  const navigate = useNavigate();
  if (!handleClose) {
    // If handleClose function is not passed, assume navigate back 1
    handleClose = () => navigate(-1);
  }

  const onSubmit: SubmitHandler<QuickerSignature> = (data) => {
    let signature: QuickerSignature = {
      printedSignatureDate: data.printedSignatureDate + '.000Z',
      printedSignatureName: data.printedSignatureName,
      siteId: mtnHandler.epaSiteId,
      siteType: siteType,
      manifestTrackingNumbers: mtn,
    };
    if ('order' in mtnHandler) {
      signature = {
        ...signature,
        transporterOrder: mtnHandler.order,
      };
    }
    htApi
      .post('/trak/manifest/sign', signature)
      .then((response: AxiosResponse) => {
        dispatch(
          addMsg({
            uniqueId: Date.now(),
            createdDate: new Date().toISOString(),
            message: `${response.data.task} ${response.statusText}`,
            alertType: 'Info',
            read: false,
            timeout: 5000,
          })
        );
      })
      .catch((error: AxiosError) => {
        dispatch(
          addMsg({
            uniqueId: Date.now(),
            createdDate: new Date().toISOString(),
            message: `${error.message}`,
            alertType: 'Error',
            read: false,
            timeout: 5000,
          })
        );
      });
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <HtForm.Group>
              <HtForm.Label>Printed Name</HtForm.Label>
              <HtForm.Control
                id="printedSignatureName"
                type="text"
                placeholder="John Doe"
                {...register(`printedSignatureName`)}
              />
            </HtForm.Group>
          </Col>
          <Col>
            <HtForm.Label htmlFor={'printedSignatureDate'}>Signature Date</HtForm.Label>
            <HtForm.InputGroup>
              <HtForm.Control
                id="printedSignatureDate"
                type="datetime-local"
                {...register(`printedSignatureDate`)}
              />
              <Button
                onClick={() => {
                  setValue('printedSignatureDate', new Date().toISOString().slice(0, -8), {
                    shouldDirty: true,
                  });
                }}
              >
                Now
              </Button>
            </HtForm.InputGroup>
          </Col>
        </Row>
        <Container>
          <Row>
            <h5>
              <i>
                Sign as site <b className="text-info">{`${mtnHandler.epaSiteId}`}</b>
              </i>
            </h5>
            <ListGroup variant="flush">
              {mtn.map((value) => {
                return (
                  <ListGroup.Item key={value}>
                    <FontAwesomeIcon icon={faFileSignature} className="text-success" />
                    {` ${value}`}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="danger" onClick={handleClose} className="mx-2">
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Sign
            </Button>
          </div>
        </Container>
      </HtForm>
    </>
  );
}

export default QuickerSignForm;
