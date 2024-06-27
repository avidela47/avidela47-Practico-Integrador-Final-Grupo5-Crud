import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realizar la solicitud para obtener el perfil del administrador
    axios.get("https://viny-record-api.vercel.app/auth/profile")
      .then((res) => {
        if (res.data.profile) {
          setProfile(res.data.profile);
        } else {
          console.error("Error al obtener el perfil del administrador:", res.data.error);
        }
      })
      .catch((err) => {
        console.error("Error en la solicitud de perfil:", err);
      })
      .finally(() => {
        setLoading(false); // Marcar la carga como completa, independientemente del resultado
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Error al cargar el perfil del administrador.</div>;
  }

  return (
    <Card style={{ width: '20rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', marginTop: '20px' }}>
      <Row>
        <Col className='colfoto'>
          {profile.photo ? (
            <Card.Img src={profile.photo} alt={profile.name} />
          ) : (
            <div>No image available</div>
          )}
        </Col>
        <Col md={12}>
          <Card.Body>
            <Card.Title className="text-center">Nombre: {profile.name}</Card.Title>
            <Card.Text className="text-center">Rol: Administrador</Card.Text>
            <Card.Text className="text-center">Email: {profile.email}</Card.Text>
            <Card.Text className="text-center">Pais: {profile.country}</Card.Text>
            <div className="text-center">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px', color: '#833AB4' }}>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px', color: '#3b5998' }}>
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px', color: '#c4302b' }}>
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px', color: '#1DA1F2' }}>
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default Profile;









