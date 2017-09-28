/*
* @Author: insane.luojie
* @Date:   2017-09-26 11:55:17
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 15:34:22
*/
	 
<%
	modules.forEach((item) => {
%>
const <%= item.name %> = import('<%= relativeToBuild(item.path) %>');
export <%= item.name %>;

<%
	});
%>

export {
	<%= 
		modules.map((item) => {
				return item.name
			})
			.join(",");
	%>
}