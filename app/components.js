/*
* @Author: insane.luojie
* @Date:   2017-09-26 11:55:34
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 15:33:50
*/

<%
	components.forEach((item) => {
	 
%>
const <%= item.name %> = import('<%= relativeToBuild(item.path) %>');
export <%= item.name %>;

<%
	});
%>

export {
	<%= 
		components.map((item) => {
				return item.name
			})
			.join(",");
	%>
}