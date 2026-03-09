package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.dto.SAMLMetadataDto;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import java.util.Locale;

@Service
public class SAMLMetadataService {

    public SAMLMetadataDto parseAndValidate(String xml) throws Exception {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document doc = db.parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));

        Element root = doc.getDocumentElement();
        String entityId = root.getAttribute("entityID");
        if (entityId == null || entityId.isBlank()) {
            // try EntitiesDescriptor -> first EntityDescriptor child
            NodeList entityDescriptors = doc.getElementsByTagName("EntityDescriptor");
            if (entityDescriptors.getLength() > 0) {
                Element ed = (Element) entityDescriptors.item(0);
                entityId = ed.getAttribute("entityID");
            }
        }

        SAMLMetadataDto out = new SAMLMetadataDto();
        out.setEntityId(entityId);

        // find SingleSignOnService element
        NodeList ssoNodes = doc.getElementsByTagNameNS("*", "SingleSignOnService");
        if (ssoNodes.getLength() == 0) {
            // fallback to any element named SingleSignOnService without namespace
            ssoNodes = doc.getElementsByTagName("SingleSignOnService");
        }
        if (ssoNodes.getLength() > 0) {
            Element sso = (Element) ssoNodes.item(0);
            String loc = sso.getAttribute("Location");
            out.setSingleSignOnService(loc);
        }

        // collect X509Certificate nodes
        NodeList x509s = doc.getElementsByTagNameNS("*", "X509Certificate");
        if (x509s.getLength() == 0) {
            x509s = doc.getElementsByTagName("X509Certificate");
        }

        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        DateTimeFormatter fmt = DateTimeFormatter.ISO_OFFSET_DATE_TIME.withLocale(Locale.ENGLISH).withZone(ZoneId.systemDefault());

        for (int i = 0; i < x509s.getLength(); i++) {
            String b64 = x509s.item(i).getTextContent().replaceAll("\\s+", "");
            if (b64 == null || b64.isBlank()) continue;
            try {
                byte[] der = Base64.getDecoder().decode(b64);
                X509Certificate cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(der));
                SAMLMetadataDto.SAMLCertificateDto cd = new SAMLMetadataDto.SAMLCertificateDto();
                cd.setRawBase64(b64);
                cd.setSubject(cert.getSubjectX500Principal().getName());
                cd.setIssuer(cert.getIssuerX500Principal().getName());
                try {
                    cert.checkValidity();
                    cd.setNotBefore(fmt.format(cert.getNotBefore().toInstant()));
                    cd.setNotAfter(fmt.format(cert.getNotAfter().toInstant()));
                } catch (Exception ve) {
                    // still set dates even if not valid
                    cd.setNotBefore(cert.getNotBefore() != null ? fmt.format(cert.getNotBefore().toInstant()) : null);
                    cd.setNotAfter(cert.getNotAfter() != null ? fmt.format(cert.getNotAfter().toInstant()) : null);
                }
                out.getCertificates().add(cd);
            } catch (IllegalArgumentException iae) {
                // invalid base64; skip
            }
        }

        // detect Signature element (basic detection, no verification for now)
        NodeList sigNodes = doc.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");
        if (sigNodes.getLength() == 0) {
            sigNodes = doc.getElementsByTagName("Signature");
        }
        out.setSignaturePresent(sigNodes.getLength() > 0);
        // signature verification requires additional setup; skipped for now
        out.setSignatureValid(null);

        // basic validation: entityId and SSO URL presence
        if (out.getEntityId() == null || out.getEntityId().isBlank()) {
            throw new IllegalArgumentException("Missing entityID in metadata");
        }
        if (out.getSingleSignOnService() == null || out.getSingleSignOnService().isBlank()) {
            throw new IllegalArgumentException("Missing SingleSignOnService Location in metadata");
        }

        return out;
    }
}
