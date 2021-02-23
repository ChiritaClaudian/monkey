import React from 'react';

export function WebLogicIssueOverview() {
  return (<li>Oracle WebLogic servers are susceptible to a remote code execution vulnerability.</li>)
}

export function WebLogicIssueReport(issue) {
  return (
      <>
        Update Oracle WebLogic server to the latest supported version.
        <CollapsibleWellComponent>
          Oracle WebLogic server at <span className="badge badge-primary">{issue.machine}</span> (<span
          className="badge badge-info" style={{margin: '2px'}}>{issue.ip_address}</span>) is vulnerable to one of <span
          className="badge badge-danger">remote code execution</span> attacks.
          <br/>
          The attack was made possible due to one of the following vulnerabilities:
          <a href={'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-10271'}> CVE-2017-10271</a> or
          <a href={'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-2725'}> CVE-2019-2725</a>
        </CollapsibleWellComponent>
      </>
    );
}
